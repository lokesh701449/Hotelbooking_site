package com.example.DemoHotelBooking.service;

import com.example.DemoHotelBooking.dto.PaymentDTO;
import com.example.DemoHotelBooking.entity.Booking;
import com.example.DemoHotelBooking.entity.Payment;
import com.example.DemoHotelBooking.exception.ResourceNotFoundException;
import com.example.DemoHotelBooking.repository.BookingRepository;
import com.example.DemoHotelBooking.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public PaymentDTO getPaymentByBooking(Long bookingId) {
        Payment payment = paymentRepository.findByBookingBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking id: " + bookingId));
        return convertToDTO(payment);
    }

    @Transactional
    public PaymentDTO processPayment(PaymentDTO paymentDTO) {
        Booking booking = bookingRepository.findById(paymentDTO.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + paymentDTO.getBookingId()));

        Payment payment = Payment.builder()
                .booking(booking)
                .paymentMethod(paymentDTO.getPaymentMethod())
                .paymentStatus(paymentDTO.getPaymentStatus())
                .paymentDate(LocalDateTime.now())
                .amount(paymentDTO.getAmount())
                .build();

        return convertToDTO(paymentRepository.save(payment));
    }

    private PaymentDTO convertToDTO(Payment payment) {
        return PaymentDTO.builder()
                .paymentId(payment.getPaymentId())
                .bookingId(payment.getBooking().getBookingId())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .paymentDate(payment.getPaymentDate())
                .amount(payment.getAmount())
                .build();
    }
}
