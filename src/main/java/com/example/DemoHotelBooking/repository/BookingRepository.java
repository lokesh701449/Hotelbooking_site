package com.example.DemoHotelBooking.repository;

import com.example.DemoHotelBooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserUserIdOrderByBookingDateDesc(Long userId);
    Optional<Booking> findByReservationNumber(String reservationNumber);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.room.roomId = :roomId AND b.bookingStatus = 'CONFIRMED' AND " +
           "NOT (b.checkOutDate <= :checkIn OR b.checkInDate >= :checkOut)")
    boolean hasOverlappingBookings(@Param("roomId") Long roomId, @Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);
}
