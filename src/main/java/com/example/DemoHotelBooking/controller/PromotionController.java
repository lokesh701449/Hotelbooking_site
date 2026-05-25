package com.example.DemoHotelBooking.controller;

import com.example.DemoHotelBooking.dto.PromotionDTO;
import com.example.DemoHotelBooking.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/promotions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @GetMapping
    public ResponseEntity<List<PromotionDTO>> getAllPromotions() {
        List<PromotionDTO> promotions = promotionService.getAllPromotions();
        return ResponseEntity.ok(promotions);
    }

    @GetMapping("/{code}")
    public ResponseEntity<PromotionDTO> getPromotionByCode(@PathVariable("code") String code) {
        PromotionDTO promotion = promotionService.getPromotionByCode(code);
        return ResponseEntity.ok(promotion);
    }

    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@Valid @RequestBody PromotionDTO promotionDTO) {
        PromotionDTO created = promotionService.createPromotion(promotionDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
