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
public class HotelDTO {
    private Long hotelId;

    @NotBlank
    private String hotelName;

    @NotBlank
    private String location;

    @NotBlank
    private String description;
}
