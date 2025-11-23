package com.smarteseva.backend.dto;

// Lombok library ka istemaal kar rahe hain code chhota rakhne ke liye
// Agar aap Lombok use nahi kar rahe, to normal getter/setter bana lena
import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}