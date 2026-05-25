package com.example.DemoHotelBooking.service;

import com.example.DemoHotelBooking.dto.PromotionDTO;
import com.example.DemoHotelBooking.entity.Promotion;
import com.example.DemoHotelBooking.exception.BadRequestException;
import com.example.DemoHotelBooking.exception.ResourceNotFoundException;
import com.example.DemoHotelBooking.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public PromotionDTO getPromotionByCode(String promoCode) {
        Promotion promotion = promotionRepository.findByPromoCodeIgnoreCase(promoCode)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found for code: " + promoCode));
        return convertToDTO(promotion);
    }

    @Transactional
    public PromotionDTO createPromotion(PromotionDTO promotionDTO) {
        if (promotionRepository.findByPromoCodeIgnoreCase(promotionDTO.getPromoCode()).isPresent()) {
            throw new BadRequestException("Promotion with code " + promotionDTO.getPromoCode() + " already exists.");
        }

        Promotion promotion = Promotion.builder()
                .promoCode(promotionDTO.getPromoCode().toUpperCase().trim())
                .discountPercentage(promotionDTO.getDiscountPercentage())
                .startDate(promotionDTO.getStartDate())
                .endDate(promotionDTO.getEndDate())
                .build();

        return convertToDTO(promotionRepository.save(promotion));
    }

    private PromotionDTO convertToDTO(Promotion promotion) {
        return PromotionDTO.builder()
                .promotionId(promotion.getPromotionId())
                .promoCode(promotion.getPromoCode())
                .discountPercentage(promotion.getDiscountPercentage())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .build();
    }
}
