//backend/src/main/java/com/smarteseva/backend/dto/UserPublicDTO.java

package com.smarteseva.backend.dto;

import com.smarteseva.backend.model.User;

import lombok.Data;

@Data
public class UserPublicDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String mobileNumber;
    private String meterNumber; // Citizen ke liye zaroori
    private String division; // Agent ke liye zaroori
    private Double latitude; // Agent ke liye zaroori
    private Double longitude;
    private String availabilityStatus; // Agent ke liye zaroori
    
    // Static method to map from User Entity to this DTO
    public static UserPublicDTO fromEntity(User user) {
        UserPublicDTO dto = new UserPublicDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setMobileNumber(user.getMobileNumber());
        dto.setMeterNumber(user.getMeterNumber());
        dto.setDivision(user.getDivision());
        dto.setLatitude(user.getLatitude());
        dto.setLongitude(user.getLongitude());
        dto.setAvailabilityStatus(user.getAvailabilityStatus());
        return dto;
    }
}