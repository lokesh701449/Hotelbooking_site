package com.example.DemoHotelBooking.controller;

import com.example.DemoHotelBooking.dto.PaymentDTO;
import com.example.DemoHotelBooking.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentDTO> getPaymentByBooking(@PathVariable("bookingId") Long bookingId) {
        PaymentDTO payment = paymentService.getPaymentByBooking(bookingId);
        return ResponseEntity.ok(payment);
    }

    @PostMapping
    public ResponseEntity<PaymentDTO> processPayment(@Valid @RequestBody PaymentDTO paymentDTO) {
        PaymentDTO created = paymentService.processPayment(paymentDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
