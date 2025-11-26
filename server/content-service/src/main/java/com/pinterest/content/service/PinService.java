package com.pinterest.content.service;

import com.pinterest.content.dto.PinRequest;
import com.pinterest.content.dto.PinResponse;
import com.pinterest.content.entity.Pin;
import com.pinterest.content.exception.CustomException;
import com.pinterest.content.repository.PinRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PinService {

    private final PinRepository pinRepository;
    private final ModelMapper modelMapper;

    @CircuitBreaker(name = "contentCircuitBreaker", fallbackMethod = "createPinFallback")
    @Transactional
    public PinResponse createPin(PinRequest request, Long userId) {
        Pin pin = modelMapper.map(request, Pin.class);
        pin.setUserId(userId);

        // Handle keywords conversion
        if (request.getKeywords() != null) {
            pin.setKeywords(String.join(",", request.getKeywords()));
        }

        pin = pinRepository.save(pin);
        return mapToResponse(pin);
    }

    public PinResponse createPinFallback(PinRequest request, Long userId, Exception ex) {
        log.error("Circuit breaker opened for createPin. Fallback method called.", ex);
        throw new CustomException("Service temporarily unavailable. Please try again later.");
    }

    @Transactional(readOnly = true)
    public PinResponse getPinById(Long pinId) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new CustomException("Pin not found"));
        return mapToResponse(pin);
    }

    @Transactional(readOnly = true)
    public List<PinResponse> getUserPins(Long userId) {
        List<Pin> pins = pinRepository.findByUserIdAndIsDraftFalse(userId);
        return pins.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PinResponse> getUserDrafts(Long userId) {
        List<Pin> pins = pinRepository.findByUserIdAndIsDraftTrue(userId);
        return pins.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PinResponse> getPublicPins() {
        List<Pin> pins = pinRepository.findByIsPublicTrueAndIsDraftFalse();
        return pins.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PinResponse> searchPins(String keyword) {
        List<Pin> pins = pinRepository.searchPins(keyword);
        return pins.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PinResponse updatePin(Long pinId, PinRequest request, Long userId) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new CustomException("Pin not found"));

        if (!pin.getUserId().equals(userId)) {
            throw new CustomException("You don't have permission to update this pin");
        }

        if (request.getTitle() != null)
            pin.setTitle(request.getTitle());
        if (request.getDescription() != null)
            pin.setDescription(request.getDescription());
        if (request.getImageUrl() != null)
            pin.setImageUrl(request.getImageUrl());
        if (request.getLink() != null)
            pin.setLink(request.getLink());
        if (request.getBoardId() != null)
            pin.setBoardId(request.getBoardId());
        if (request.getIsPublic() != null)
            pin.setIsPublic(request.getIsPublic());
        if (request.getIsDraft() != null)
            pin.setIsDraft(request.getIsDraft());

        if (request.getKeywords() != null) {
            pin.setKeywords(String.join(",", request.getKeywords()));
        }

        pin = pinRepository.save(pin);
        return mapToResponse(pin);
    }

    @Transactional
    public void deletePin(Long pinId, Long userId) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new CustomException("Pin not found"));

        if (!pin.getUserId().equals(userId)) {
            throw new CustomException("You don't have permission to delete this pin");
        }

        pinRepository.delete(pin);
    }

    private PinResponse mapToResponse(Pin pin) {
        PinResponse response = modelMapper.map(pin, PinResponse.class);
        if (pin.getKeywords() != null && !pin.getKeywords().isEmpty()) {
            response.setKeywords(List.of(pin.getKeywords().split(",")));
        } else {
            response.setKeywords(List.of());
        }
        return response;
    }
}
