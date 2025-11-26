package com.pinterest.auth.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // In-memory storage for OTPs: Email -> OTP
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String generateOtp(String email) {
        // Generate a 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));
        otpStorage.put(email, otp);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(email); // OTP is one-time use
            return true;
        }
        return false;
    }
}
