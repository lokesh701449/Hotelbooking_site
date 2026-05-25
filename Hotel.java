package com.example.DemoHotelBooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "HOTELS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "rooms")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hotel_id")
    private Long hotelId;

    @NotBlank
    @Column(name = "hotel_name")
    private String hotelName;

    @NotBlank
    @Column(name = "location")
    private String location;

    @NotBlank
    @Column(name = "description", length = 1000)
    private String description;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Room> rooms;
}
