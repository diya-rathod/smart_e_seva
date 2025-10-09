package com.smarteseva.backend.dto;

import java.time.LocalDateTime;

import com.smarteseva.backend.entity.Complaint;

import lombok.Data;

@Data
public class ComplaintResponseDTO {

    private Long id;
    private String ticketId;
    private String category;
    private String description;
    private String status;
    private LocalDateTime dateRaised;
    private String location;
    private String landmark;
    private Double latitude;
    private Double longitude;
    
    // Yahan hum poora User object nahi, balki sirf CitizenDTO bhejenge
    private CitizenDTO citizen; 
    private AgentDTO agent;

    
    // Agent abhi null hai, to usko abhi ke liye skip kar sakte hain

    // Helper method to convert an Entity to a DTO
    public static ComplaintResponseDTO fromEntity(Complaint complaint) {
        ComplaintResponseDTO dto = new ComplaintResponseDTO();
        dto.setId(complaint.getId());
        dto.setTicketId(complaint.getTicketId());
        dto.setCategory(complaint.getCategory());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus());
        dto.setDateRaised(complaint.getDateRaised());
        dto.setLocation(complaint.getLocation());
        dto.setLandmark(complaint.getLandmark());
        dto.setLatitude(complaint.getLatitude());
        dto.setLongitude(complaint.getLongitude());

        if (complaint.getCitizen() != null) {
            CitizenDTO citizenDto = new CitizenDTO();
            citizenDto.setId(complaint.getCitizen().getId());
            citizenDto.setName(complaint.getCitizen().getName());
            citizenDto.setEmail(complaint.getCitizen().getEmail());
            citizenDto.setMobileNumber(complaint.getCitizen().getMobileNumber());
            citizenDto.setMeterNumber(complaint.getCitizen().getMeterNumber());
            citizenDto.setServiceAddress(complaint.getCitizen().getServiceAddress());
            dto.setCitizen(citizenDto);
        }

        if (complaint.getAgent() != null) {
            AgentDTO agentDto = new AgentDTO();
            agentDto.setId(complaint.getAgent().getId());
            agentDto.setName(complaint.getAgent().getName());
            agentDto.setEmail(complaint.getAgent().getEmail());
            // ... (copy other agent fields)
            dto.setAgent(agentDto);
        }
        
        return dto;
    }
}