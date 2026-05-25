package com.example.DemoHotelBooking.service;

import com.example.DemoHotelBooking.dto.HotelDTO;
import com.example.DemoHotelBooking.entity.Hotel;
import com.example.DemoHotelBooking.exception.ResourceNotFoundException;
import com.example.DemoHotelBooking.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    public List<HotelDTO> getAllHotels(String location) {
        List<Hotel> hotels;
        if (location != null && !location.trim().isEmpty()) {
            hotels = hotelRepository.findByLocationContainingIgnoreCase(location);
        } else {
            hotels = hotelRepository.findAll();
        }
        return hotels.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public HotelDTO getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        return convertToDTO(hotel);
    }

    @Transactional
    public HotelDTO createHotel(HotelDTO hotelDTO) {
        Hotel hotel = Hotel.builder()
                .hotelName(hotelDTO.getHotelName())
                .location(hotelDTO.getLocation())
                .description(hotelDTO.getDescription())
                .build();
        return convertToDTO(hotelRepository.save(hotel));
    }

    @Transactional
    public HotelDTO updateHotel(Long id, HotelDTO hotelDTO) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        hotel.setHotelName(hotelDTO.getHotelName());
        hotel.setLocation(hotelDTO.getLocation());
        hotel.setDescription(hotelDTO.getDescription());

        return convertToDTO(hotelRepository.save(hotel));
    }

    @Transactional
    public void deleteHotel(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Hotel not found with id: " + id);
        }
        hotelRepository.deleteById(id);
    }

    public List<String> getUniqueLocations() {
        return hotelRepository.findUniqueLocations();
    }

    private HotelDTO convertToDTO(Hotel hotel) {
        return HotelDTO.builder()
                .hotelId(hotel.getHotelId())
                .hotelName(hotel.getHotelName())
                .location(hotel.getLocation())
                .description(hotel.getDescription())
                .build();
    }
}
