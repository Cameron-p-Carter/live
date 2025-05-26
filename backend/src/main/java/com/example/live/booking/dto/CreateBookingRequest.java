package com.example.live.booking.dto;

import java.time.LocalDateTime;

public class CreateBookingRequest {
    private Long serviceId;
    private LocalDateTime bookingTime;

    // Default constructor for JSON deserialization
    public CreateBookingRequest() {}

    // Getters and Setters with validation
    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        if (serviceId == null) {
            throw new IllegalArgumentException("Service ID is required");
        }
        this.serviceId = serviceId;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        if (bookingTime == null) {
            throw new IllegalArgumentException("Booking time is required");
        }
        if (bookingTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Booking time must be in the future");
        }
        this.bookingTime = bookingTime;
    }

    // Validation method
    public void validate() {
        if (serviceId == null || bookingTime == null) {
            throw new IllegalStateException("Service ID and booking time are required");
        }
        if (bookingTime.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Booking time must be in the future");
        }
    }
}
