package com.example.live.service.dto;

import com.example.live.service.Service;
import com.example.live.service.ServiceCategory;
import com.example.live.user.User;
import java.math.BigDecimal;

public class ServiceResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String estimatedDuration;
    private String serviceArea;
    private boolean isActive;
    private ServiceCategory category;
    
    // Provider details
    private Long providerId;
    private String providerName;
    private String providerEmail;

    // Factory Method Pattern: Creates ServiceResponse from Service entity
    public static ServiceResponse fromService(Service service) {
        ServiceResponse response = new ServiceResponse();
        response.setId(service.getId());
        response.setTitle(service.getTitle());
        response.setDescription(service.getDescription());
        response.setPrice(service.getPrice());
        response.setEstimatedDuration(service.getEstimatedDuration());
        response.setServiceArea(service.getServiceArea());
        response.setActive(service.isActive());
        response.setCategory(service.getCategory());
        
        // Set provider details
        User provider = service.getProvider();
        response.setProviderId(provider.getId());
        response.setProviderName(provider.getFirstName() + " " + provider.getLastName());
        response.setProviderEmail(provider.getEmail());
        
        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
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
        this.price = price;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public ServiceCategory getCategory() {
        return category;
    }

    public void setCategory(ServiceCategory category) {
        this.category = category;
    }

    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public String getProviderEmail() {
        return providerEmail;
    }

    public void setProviderEmail(String providerEmail) {
        this.providerEmail = providerEmail;
    }
}
