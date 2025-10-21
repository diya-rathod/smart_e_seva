//backend/src/main/java/com/smarteseva/backend/dto/VerificationRequestDTO.java

package com.smarteseva.backend.dto;

import lombok.Data;

@Data
public class VerificationRequestDTO {
    // Agent se receive hone wala 6-digit code
    private String code; 
}