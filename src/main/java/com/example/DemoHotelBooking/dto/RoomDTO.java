package com.example.DemoHotelBooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDTO {
    private Long roomId;

    @NotNull
    private Long hotelId;
    private String hotelName;

    @NotNull
    private Long categoryId;
    private String categoryName;

    @NotBlank
    private String roomNumber;

    @NotNull
    private BigDecimal price;

    @NotNull
    private Boolean availabilityStatus;

    private List<AmenityDTO> amenities;
}
