//backend/src/main/java/com/smarteseva/backend/dto/AgentResponseDTO.java

package com.smarteseva.backend.dto;

import com.smarteseva.backend.model.User;

import lombok.Data;

@Data
public class AgentResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String mobileNumber;
    private String employeeId;
    private String division;
    private Double latitude;
    private Double longitude;
    private String availabilityStatus;

    // Static method to map from User Entity to this DTO
    public static AgentResponseDTO fromEntity(User user) {
        AgentResponseDTO dto = new AgentResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setMobileNumber(user.getMobileNumber());
        dto.setEmployeeId(user.getEmployeeId());
        dto.setDivision(user.getDivision());
        dto.setLatitude(user.getLatitude());
        dto.setLongitude(user.getLongitude());
        dto.setAvailabilityStatus(user.getAvailabilityStatus());
        return dto;
    }
}