package com.example.DemoHotelBooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionDTO {
    private Long promotionId;

    @NotBlank
    private String promoCode;

    @NotNull
    private BigDecimal discountPercentage;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;
}
