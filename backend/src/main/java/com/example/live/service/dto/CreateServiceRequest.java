package com.example.live.service.dto;

import com.example.live.service.ServiceCategory;
import java.math.BigDecimal;

public class CreateServiceRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private String estimatedDuration;
    private String serviceArea;
    private ServiceCategory category;

    // Default constructor for JSON deserialization
    public CreateServiceRequest() {}

    // Getters and Setters with validation
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }
        this.price = price;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        if (estimatedDuration == null || estimatedDuration.trim().isEmpty()) {
            throw new IllegalArgumentException("Estimated duration is required");
        }
        this.estimatedDuration = estimatedDuration;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        if (serviceArea == null || serviceArea.trim().isEmpty()) {
            throw new IllegalArgumentException("Service area is required");
        }
        this.serviceArea = serviceArea;
    }

    public ServiceCategory getCategory() {
        return category;
    }

    public void setCategory(ServiceCategory category) {
        if (category == null) {
            throw new IllegalArgumentException("Category is required");
        }
        this.category = category;
    }

    // Validation method to ensure all required fields are present
    public void validate() {
        if (title == null || price == null || estimatedDuration == null || 
            serviceArea == null || category == null) {
            throw new IllegalStateException("Required fields must not be null");
        }
    }
}
