package com.example.DemoHotelBooking.service;

import com.example.DemoHotelBooking.dto.BookingRequest;
import com.example.DemoHotelBooking.dto.BookingResponse;
import com.example.DemoHotelBooking.entity.*;
import com.example.DemoHotelBooking.exception.BadRequestException;
import com.example.DemoHotelBooking.exception.ResourceNotFoundException;
import com.example.DemoHotelBooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private EmailService emailService;

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return bookingRepository.findByUserUserIdOrderByBookingDateDesc(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        if (!room.getAvailabilityStatus()) {
            throw new BadRequestException("Room is not available for booking.");
        }

        // Validate booking dates
        LocalDate checkIn = request.getCheckInDate();
        LocalDate checkOut = request.getCheckOutDate();

        if (checkIn.isBefore(LocalDate.now())) {
            throw new BadRequestException("Check-in date cannot be in the past.");
        }
        if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
            throw new BadRequestException("Check-out date must be after check-in date.");
        }

        // Check for double booking
        boolean overlap = bookingRepository.hasOverlappingBookings(room.getRoomId(), checkIn, checkOut);
        if (overlap) {
            throw new BadRequestException("This room is already booked for the selected dates!");
        }

        // Calculate original total price
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal originalAmount = room.getPrice().multiply(BigDecimal.valueOf(nights));
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal finalAmount = originalAmount;

        // Apply Promotion if promoCode is provided
        if (request.getPromoCode() != null && !request.getPromoCode().trim().isEmpty()) {
            Promotion promotion = promotionRepository.findByPromoCodeIgnoreCase(request.getPromoCode().trim())
                    .orElseThrow(() -> new BadRequestException("Invalid promotion code."));

            // Check if promo is valid for current date
            LocalDate today = LocalDate.now();
            if (today.isBefore(promotion.getStartDate()) || today.isAfter(promotion.getEndDate())) {
                throw new BadRequestException("This promotion code is expired or not active yet.");
            }

            discountAmount = originalAmount.multiply(promotion.getDiscountPercentage())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            finalAmount = originalAmount.subtract(discountAmount);
        }

        // Generate reservation number
        String reservationNumber = "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Create and Save Booking
        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkInDate(checkIn)
                .checkOutDate(checkOut)
                .bookingDate(LocalDateTime.now())
                .bookingStatus("CONFIRMED")
                .reservationNumber(reservationNumber)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Process and Save Payment
        Payment payment = Payment.builder()
                .booking(savedBooking)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("PAID") // Simulate payment success
                .paymentDate(LocalDateTime.now())
                .amount(finalAmount)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Automatically update room status (optional: can be updated as needed or queried dynamically)
        // For simple demos, we can keep the status as true/false or update it if booking is active today.
        // Let's keep availabilityStatus true unless it's booked today.
        if (!checkIn.isAfter(LocalDate.now()) && !checkOut.isBefore(LocalDate.now())) {
            // room is occupied today
            // We can choose to update it, but room queries check booking overlaps anyway!
        }

        // Trigger confirmation email
        emailService.sendBookingConfirmation(savedBooking, savedPayment, discountAmount);

        return convertToResponse(savedBooking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getBookingStatus().equals("CANCELLED")) {
            throw new BadRequestException("Booking is already cancelled.");
        }

        booking.setBookingStatus("CANCELLED");
        Booking updatedBooking = bookingRepository.save(booking);

        // Update payment status if exists
        paymentRepository.findByBookingBookingId(bookingId).ifPresent(payment -> {
            payment.setPaymentStatus("REFUNDED");
            paymentRepository.save(payment);
        });

        return convertToResponse(updatedBooking);
    }

    private BookingResponse convertToResponse(Booking booking) {
        Payment payment = paymentRepository.findByBookingBookingId(booking.getBookingId()).orElse(null);

        long nights = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
        BigDecimal pricePerNight = booking.getRoom().getPrice();
        BigDecimal originalAmount = pricePerNight.multiply(BigDecimal.valueOf(nights));

        BigDecimal finalAmount = originalAmount;
        BigDecimal discountAmount = BigDecimal.ZERO;

        String paymentMethod = "N/A";
        String paymentStatus = "N/A";
        Long paymentId = null;

        if (payment != null) {
            finalAmount = payment.getAmount();
            discountAmount = originalAmount.subtract(finalAmount);
            paymentMethod = payment.getPaymentMethod();
            paymentStatus = payment.getPaymentStatus();
            paymentId = payment.getPaymentId();
        }

        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .userId(booking.getUser().getUserId())
                .userName(booking.getUser().getName())
                .userEmail(booking.getUser().getEmail())
                .roomId(booking.getRoom().getRoomId())
                .roomNumber(booking.getRoom().getRoomNumber())
                .pricePerNight(pricePerNight)
                .hotelId(booking.getRoom().getHotel().getHotelId())
                .hotelName(booking.getRoom().getHotel().getHotelName())
                .location(booking.getRoom().getHotel().getLocation())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .bookingDate(booking.getBookingDate())
                .bookingStatus(booking.getBookingStatus())
                .reservationNumber(booking.getReservationNumber())
                .originalAmount(originalAmount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .paymentId(paymentId)
                .paymentStatus(paymentStatus)
                .paymentMethod(paymentMethod)
                .build();
    }
}
