package com.example.DemoHotelBooking.repository;

import com.example.DemoHotelBooking.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findByPromoCodeIgnoreCase(String promoCode);
}
