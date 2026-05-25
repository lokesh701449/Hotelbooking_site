package com.example.DemoHotelBooking.repository;

import com.example.DemoHotelBooking.entity.RoomCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoomCategoryRepository extends JpaRepository<RoomCategory, Long> {
    Optional<RoomCategory> findByCategoryNameIgnoreCase(String categoryName);
}
