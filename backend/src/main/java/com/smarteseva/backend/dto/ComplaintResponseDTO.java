//backend/src/main/java/com/smarteseva/backend/dto/ComplaintResponseDTO.java

package com.smarteseva.backend.dto;

import java.time.LocalDateTime;

import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;

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
 
 // Nested DTOs (Assuming CitizenDTO/AgentDTO updated hain)
 private CitizenDTO citizen; 
 private AgentDTO agent;

 
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

  // Citizen Mapping
  if (complaint.getCitizen() != null) {
 User citizen = complaint.getCitizen();
 CitizenDTO citizenDto = new CitizenDTO();
 
 citizenDto.setId(citizen.getId());
 citizenDto.setName(citizen.getName());
 citizenDto.setEmail(citizen.getEmail());
 citizenDto.setMobileNumber(citizen.getMobileNumber());
 citizenDto.setMeterNumber(citizen.getMeterNumber());
 // Agar CitizenDTO mein serviceAddress hai toh set karein
 citizenDto.setServiceAddress(citizen.getServiceAddress()); 
 
 dto.setCitizen(citizenDto);
  }

  // Agent Mapping
  if (complaint.getAgent() != null) {
 User agent = complaint.getAgent();
 AgentDTO agentDto = new AgentDTO();
 
 agentDto.setId(agent.getId());
 agentDto.setName(agent.getName());
 agentDto.setEmail(agent.getEmail());
 // Assignment/Location Fields set karein
 agentDto.setMobileNumber(agent.getMobileNumber());
 agentDto.setEmployeeId(agent.getEmployeeId());
 agentDto.setDivision(agent.getDivision());
 agentDto.setLatitude(agent.getLatitude());
 agentDto.setLongitude(agent.getLongitude());
 agentDto.setAvailabilityStatus(agent.getAvailabilityStatus());
            agentDto.setStatus(agent.getStatus()); 
            
 dto.setAgent(agentDto);
  }
  
  return dto;
 }
}