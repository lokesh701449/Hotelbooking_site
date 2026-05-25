package com.example.DemoHotelBooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private Long paymentId;

    @NotNull
    private Long bookingId;

    @NotBlank
    private String paymentStatus; // PAID, FAILED, PENDING

    @NotBlank
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, PAYPAL

    private LocalDateTime paymentDate;

    @NotNull
    private BigDecimal amount;
}
