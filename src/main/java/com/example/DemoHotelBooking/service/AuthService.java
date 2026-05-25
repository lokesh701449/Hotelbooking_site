package com.example.DemoHotelBooking.service;

import com.example.DemoHotelBooking.dto.AuthRequest;
import com.example.DemoHotelBooking.dto.AuthResponse;
import com.example.DemoHotelBooking.dto.RegisterRequest;
import com.example.DemoHotelBooking.entity.User;
import com.example.DemoHotelBooking.exception.BadRequestException;
import com.example.DemoHotelBooking.repository.UserRepository;
import com.example.DemoHotelBooking.security.JwtUtils;
import com.example.DemoHotelBooking.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(item -> item.getAuthority())
                .orElse("ROLE_CUSTOMER");

        // Strip ROLE_ prefix for simple client response if desired, or return as is. Let's return as is.
        return AuthResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .role(role)
                .type("Bearer")
                .build();
    }

    public User registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        // Set role default to CUSTOMER if not provided or invalid
        String role = signUpRequest.getRole();
        if (role == null || role.trim().isEmpty()) {
            role = "CUSTOMER";
        } else {
            role = role.toUpperCase();
            if (!role.equals("ADMIN") && !role.equals("CUSTOMER")) {
                role = "CUSTOMER";
            }
        }

        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .phone(signUpRequest.getPhone())
                .role(role)
                .build();

        return userRepository.save(user);
    }
}
