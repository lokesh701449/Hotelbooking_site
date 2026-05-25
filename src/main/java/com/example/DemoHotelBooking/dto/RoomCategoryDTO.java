package com.example.DemoHotelBooking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomCategoryDTO {
    private Long categoryId;

    @NotBlank
    private String categoryName;
}
