package com.pinterest.business.service;

import com.pinterest.business.dto.BusinessProfileRequest;
import com.pinterest.business.dto.BusinessProfileResponse;
import com.pinterest.business.entity.BusinessProfile;
import com.pinterest.business.exception.CustomException;
import com.pinterest.business.repository.BusinessProfileRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessProfileService {
    private final BusinessProfileRepository repository;
    private final ModelMapper modelMapper;

    @Transactional
    public BusinessProfileResponse createProfile(BusinessProfileRequest request, Long userId) {
        BusinessProfile profile = modelMapper.map(request, BusinessProfile.class);
        profile.setUserId(userId);
        profile = repository.save(profile);
        return modelMapper.map(profile, BusinessProfileResponse.class);
    }

    @Transactional(readOnly = true)
    public List<BusinessProfileResponse> getAllProfiles() {
        return repository.findAll().stream()
                .map(p -> modelMapper.map(p, BusinessProfileResponse.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BusinessProfileResponse getProfile(Long businessId) {
        BusinessProfile profile = repository.findById(businessId)
                .orElseThrow(() -> new CustomException("Business profile not found"));
        return modelMapper.map(profile, BusinessProfileResponse.class);
    }

    @Transactional(readOnly = true)
    public List<BusinessProfileResponse> searchProfiles(String keyword) {
        return repository.searchProfiles(keyword).stream()
                .map(p -> modelMapper.map(p, BusinessProfileResponse.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BusinessProfileResponse getProfileByUserId(Long userId) {
        List<BusinessProfile> profiles = repository.findByUserId(userId);
        if (profiles.isEmpty()) {
            return null;
        }
        // Return the first one if duplicates exist
        return modelMapper.map(profiles.get(0), BusinessProfileResponse.class);
    }

    @Transactional
    public BusinessProfileResponse updateProfile(Long businessId, BusinessProfileRequest request) {
        BusinessProfile profile = repository.findById(businessId)
                .orElseThrow(() -> new CustomException("Business profile not found"));

        profile.setBusinessName(request.getBusinessName());
        profile.setDescription(request.getDescription());
        profile.setWebsite(request.getWebsite());
        if (request.getLogo() != null && !request.getLogo().isEmpty()) {
            profile.setLogo(request.getLogo());
        }
        if (request.getCategory() != null) {
            profile.setCategory(request.getCategory());
        }

        profile = repository.save(profile);
        return modelMapper.map(profile, BusinessProfileResponse.class);
    }
}
