package com.example.DemoHotelBooking.repository;

import com.example.DemoHotelBooking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelHotelId(Long hotelId);

    @Query("SELECT r FROM Room r WHERE r.availabilityStatus = true AND r.roomId NOT IN (" +
           "SELECT b.room.roomId FROM Booking b WHERE b.bookingStatus = 'CONFIRMED' AND " +
           "NOT (b.checkOutDate <= :checkIn OR b.checkInDate >= :checkOut)" +
           ")")
    List<Room> findAvailableRoomsForDates(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);

    @Query("SELECT r FROM Room r WHERE r.hotel.hotelId = :hotelId AND r.availabilityStatus = true AND r.roomId NOT IN (" +
           "SELECT b.room.roomId FROM Booking b WHERE b.bookingStatus = 'CONFIRMED' AND " +
           "NOT (b.checkOutDate <= :checkIn OR b.checkInDate >= :checkOut)" +
           ")")
    List<Room> findAvailableRoomsForHotelAndDates(@Param("hotelId") Long hotelId, @Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);
}
