package com.example.DemoHotelBooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "BOOKINGS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @NotNull
    @Column(name = "check_in_date")
    private LocalDate checkInDate;

    @NotNull
    @Column(name = "check_out_date")
    private LocalDate checkOutDate;

    @NotNull
    @Column(name = "booking_date")
    private LocalDateTime bookingDate;

    @NotBlank
    @Column(name = "booking_status")
    private String bookingStatus; // CONFIRMED, CANCELLED, PENDING

    @NotBlank
    @Column(name = "reservation_number", unique = true)
    private String reservationNumber;
}
