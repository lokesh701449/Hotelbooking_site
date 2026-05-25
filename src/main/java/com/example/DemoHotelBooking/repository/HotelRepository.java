package com.example.DemoHotelBooking.repository;

import com.example.DemoHotelBooking.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByLocationContainingIgnoreCase(String location);
    List<Hotel> findByHotelNameContainingIgnoreCase(String hotelName);

    @Query("SELECT DISTINCT h.location FROM Hotel h")
    List<String> findUniqueLocations();
}
