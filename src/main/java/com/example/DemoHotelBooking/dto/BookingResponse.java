package com.example.DemoHotelBooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long bookingId;

    private Long userId;
    private String userName;
    private String userEmail;


    private Long roomId;
    private String roomNumber;
    private BigDecimal pricePerNight;

    private Long hotelId;
    private String hotelName;
    private String location;


    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalDateTime bookingDate;
    private String bookingStatus;
    private String reservationNumber;


    private BigDecimal originalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;


    private Long paymentId;
    private String paymentStatus;
    private String paymentMethod;
}
