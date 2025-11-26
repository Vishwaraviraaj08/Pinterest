package com.pinterest.auth.controller;

import com.pinterest.auth.dto.OtpRequest;
import com.pinterest.auth.dto.OtpVerificationRequest;
import com.pinterest.auth.entity.User;
import com.pinterest.auth.repository.UserRepository;
import com.pinterest.auth.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;
    private final UserRepository userRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generateOtp(@RequestBody OtpRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        // Removed mobile number check as per requirement

        String otp = otpService.generateOtp(request.getEmail());

        // In a real app, we would send SMS/Email. Here we return it for simulation.
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP generated successfully");
        response.put("otp", otp); // Returning OTP for simulation as requested

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationRequest request) {
        boolean isValid = otpService.validateOtp(request.getEmail(), request.getOtp());
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
        }
    }
}
