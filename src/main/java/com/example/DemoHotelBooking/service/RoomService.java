package com.example.DemoHotelBooking.service;

import com.example.DemoHotelBooking.dto.AmenityDTO;
import com.example.DemoHotelBooking.dto.RoomDTO;
import com.example.DemoHotelBooking.entity.Amenity;
import com.example.DemoHotelBooking.entity.Hotel;
import com.example.DemoHotelBooking.entity.Room;
import com.example.DemoHotelBooking.entity.RoomCategory;
import com.example.DemoHotelBooking.exception.BadRequestException;
import com.example.DemoHotelBooking.exception.ResourceNotFoundException;
import com.example.DemoHotelBooking.repository.AmenityRepository;
import com.example.DemoHotelBooking.repository.HotelRepository;
import com.example.DemoHotelBooking.repository.RoomCategoryRepository;
import com.example.DemoHotelBooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomCategoryRepository roomCategoryRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<RoomDTO> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotelHotelId(hotelId).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public RoomDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return convertToDTO(room);
    }

    public List<RoomDTO> getAvailableRooms(LocalDate checkIn, LocalDate checkOut, Long hotelId) {
        if (checkIn == null || checkOut == null) {
            throw new BadRequestException("Check-in and Check-out dates are required.");
        }
        if (checkIn.isAfter(checkOut) || checkIn.isEqual(checkOut)) {
            throw new BadRequestException("Check-out date must be after check-in date.");
        }
        if (checkIn.isBefore(LocalDate.now())) {
            throw new BadRequestException("Check-in date cannot be in the past.");
        }

        List<Room> rooms;
        if (hotelId != null) {
            rooms = roomRepository.findAvailableRoomsForHotelAndDates(hotelId, checkIn, checkOut);
        } else {
            rooms = roomRepository.findAvailableRoomsForDates(checkIn, checkOut);
        }
        return rooms.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public RoomDTO createRoom(RoomDTO roomDTO) {
        Hotel hotel = hotelRepository.findById(roomDTO.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + roomDTO.getHotelId()));

        RoomCategory category = roomCategoryRepository.findById(roomDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Room category not found with id: " + roomDTO.getCategoryId()));

        List<Amenity> amenities = new ArrayList<>();
        if (roomDTO.getAmenities() != null) {
            for (AmenityDTO amenityDTO : roomDTO.getAmenities()) {
                Amenity amenity = amenityRepository.findById(amenityDTO.getAmenityId())
                        .orElseThrow(() -> new ResourceNotFoundException("Amenity not found with id: " + amenityDTO.getAmenityId()));
                amenities.add(amenity);
            }
        }

        Room room = Room.builder()
                .hotel(hotel)
                .category(category)
                .roomNumber(roomDTO.getRoomNumber())
                .price(roomDTO.getPrice())
                .availabilityStatus(roomDTO.getAvailabilityStatus())
                .amenities(amenities)
                .build();

        return convertToDTO(roomRepository.save(room));
    }

    @Transactional
    public RoomDTO updateRoom(Long id, RoomDTO roomDTO) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        Hotel hotel = hotelRepository.findById(roomDTO.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + roomDTO.getHotelId()));

        RoomCategory category = roomCategoryRepository.findById(roomDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Room category not found with id: " + roomDTO.getCategoryId()));

        List<Amenity> amenities = new ArrayList<>();
        if (roomDTO.getAmenities() != null) {
            for (AmenityDTO amenityDTO : roomDTO.getAmenities()) {
                Amenity amenity = amenityRepository.findById(amenityDTO.getAmenityId())
                        .orElseThrow(() -> new ResourceNotFoundException("Amenity not found with id: " + amenityDTO.getAmenityId()));
                amenities.add(amenity);
            }
        }

        room.setHotel(hotel);
        room.setCategory(category);
        room.setRoomNumber(roomDTO.getRoomNumber());
        room.setPrice(roomDTO.getPrice());
        room.setAvailabilityStatus(roomDTO.getAvailabilityStatus());
        room.setAmenities(amenities);

        return convertToDTO(roomRepository.save(room));
    }

    @Transactional
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }

    private RoomDTO convertToDTO(Room room) {
        List<AmenityDTO> amenities = room.getAmenities().stream()
                .map(a -> AmenityDTO.builder().amenityId(a.getAmenityId()).amenityName(a.getAmenityName()).build())
                .collect(Collectors.toList());

        return RoomDTO.builder()
                .roomId(room.getRoomId())
                .hotelId(room.getHotel().getHotelId())
                .hotelName(room.getHotel().getHotelName())
                .categoryId(room.getCategory().getCategoryId())
                .categoryName(room.getCategory().getCategoryName())
                .roomNumber(room.getRoomNumber())
                .price(room.getPrice())
                .availabilityStatus(room.getAvailabilityStatus())
                .amenities(amenities)
                .build();
    }
}
