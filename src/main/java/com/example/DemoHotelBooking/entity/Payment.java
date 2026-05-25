package com.example.DemoHotelBooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "PAYMENTS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @NotBlank
    @Column(name = "payment_status")
    private String paymentStatus; // PAID, FAILED, PENDING

    @NotBlank
    @Column(name = "payment_method")
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, PAYPAL, CASH

    @NotNull
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @NotNull
    @Column(name = "amount")
    private BigDecimal amount;
}
