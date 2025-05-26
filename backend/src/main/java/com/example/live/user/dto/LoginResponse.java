package com.example.live.user.dto;

public class LoginResponse {
    private Long userId;
    private String message;
    private boolean success;

    public LoginResponse(Long userId, String message, boolean success) {
        this.userId = userId;
        this.message = message;
        this.success = success;
    }

    // Static factory methods for common responses
    public static LoginResponse success(Long userId) {
        return new LoginResponse(userId, "Login successful", true);
    }

    public static LoginResponse failure(String message) {
        return new LoginResponse(null, message, false);
    }

    // Getters
    public Long getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }

    public boolean isSuccess() {
        return success;
    }
}
