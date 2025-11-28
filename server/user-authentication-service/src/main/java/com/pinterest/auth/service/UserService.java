package com.pinterest.auth.service;

import com.pinterest.auth.dto.*;
import com.pinterest.auth.entity.User;
import com.pinterest.auth.exception.CustomException;
import com.pinterest.auth.repository.UserRepository;
import com.pinterest.auth.util.JwtUtil;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ModelMapper modelMapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        try {
            log.info("Starting registration for email: {}", request.getEmail());

            if (!request.getPassword().equals(request.getConfirmPassword())) {
                throw new CustomException("Passwords do not match");
            }

            if (userRepository.existsByEmail(request.getEmail())) {
                throw new CustomException("Email is already in use");
            }

            // Auto-generate username from email if not provided
            String username = request.getUsername();
            if (username == null || username.trim().isEmpty()) {
                username = request.getEmail().split("@")[0];
                log.info("Auto-generated username from email: {}", username);
            }

            if (userRepository.existsByUsername(username)) {
                throw new CustomException("Username is already taken");
            }

            User user = new User();
            user.setEmail(request.getEmail());
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            // Handle optional fields
            user.setFirstName(request.getFirstName() != null ? request.getFirstName() : "");
            user.setLastName(request.getLastName() != null ? request.getLastName() : "");
            user.setMobileNumber(request.getMobileNumber());

            log.info("Saving user to database...");
            user = userRepository.save(user);
            log.info("User saved with ID: {}", user.getId());

            log.info("Generating JWT token...");
            String token = jwtUtil.generateToken(user.getEmail(), user.getId());
            log.info("Token generated successfully");

            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setEmail(user.getEmail());
            response.setUsername(user.getUsername());
            response.setUserId(user.getId());
            response.setMessage("Registration successful");

            log.info("Registration successful for user: {}", user.getEmail());
            return response;
        } catch (CustomException e) {
            log.error("Custom exception during registration: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during registration: ", e);
            throw new CustomException("Registration failed: " + e.getMessage());
        }
    }

    @CircuitBreaker(name = "loginCircuitBreaker", fallbackMethod = "loginFallback")
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Attempting login for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("Wrong user name or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException("Wrong user name or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setUsername(user.getUsername());
        response.setUserId(user.getId());
        response.setMessage("Login successful");

        log.info("Login successful for user: {}", user.getEmail());
        return response;
    }

    public AuthResponse loginFallback(LoginRequest request, Exception ex) {
        if (ex instanceof CustomException) {
            throw (CustomException) ex;
        }
        log.error("Circuit breaker opened for login. Fallback method called.", ex);
        throw new CustomException("Service temporarily unavailable. Please try again later.");
    }

    @Transactional
    public AuthResponse resetPassword(PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("User not found with the provided email"));

        // Removed mobile number verification as per requirement

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setUsername(user.getUsername());
        response.setUserId(user.getId());
        response.setMessage("Password reset successful");

        return response;
    }

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));
        return modelMapper.map(user, UserResponse.class);
    }

    @Transactional
    public UserResponse updateUserProfile(Long userId, UserResponse updateRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));

        if (updateRequest.getFirstName() != null) {
            user.setFirstName(updateRequest.getFirstName());
        }
        if (updateRequest.getLastName() != null) {
            user.setLastName(updateRequest.getLastName());
        }
        if (updateRequest.getBio() != null) {
            user.setBio(updateRequest.getBio());
        }
        if (updateRequest.getAvatar() != null) {
            user.setAvatar(updateRequest.getAvatar());
        }

        user = userRepository.save(user);
        return modelMapper.map(user, UserResponse.class);
    }

    @Transactional(readOnly = true)
    public java.util.List<UserResponse> searchUsers(String keyword) {
        java.util.List<User> users = userRepository
                .findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword);
        return users.stream()
                .map(user -> modelMapper.map(user, UserResponse.class))
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional(readOnly = true)
    public java.util.List<UserResponse> getUsersByIds(java.util.List<Long> userIds) {
        java.util.List<User> users = userRepository.findAllById(userIds);
        return users.stream()
                .map(user -> modelMapper.map(user, UserResponse.class))
                .collect(java.util.stream.Collectors.toList());
    }
}
