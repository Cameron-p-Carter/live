package com.example.live.review.dto;

import com.example.live.review.Review;
import java.time.LocalDateTime;

public class ReviewResponse {
    private Long id;
    private Long bookingId;
    
    // Service details
    private Long serviceId;
    private String serviceName;
    
    // Consumer details
    private Long consumerId;
    private String consumerName;
    
    // Provider details
    private Long providerId;
    private String providerName;
    
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    // Factory Method Pattern: Creates ReviewResponse from Review entity
    public static ReviewResponse fromReview(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setBookingId(review.getBooking().getId());
        
        // Service details
        response.setServiceId(review.getBooking().getService().getId());
        response.setServiceName(review.getBooking().getService().getTitle());
        
        // Consumer details
        response.setConsumerId(review.getConsumer().getId());
        response.setConsumerName(review.getConsumer().getFirstName() + " " + review.getConsumer().getLastName());
        
        // Provider details
        response.setProviderId(review.getProvider().getId());
        response.setProviderName(review.getProvider().getFirstName() + " " + review.getProvider().getLastName());
        
        // Review details
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());
        
        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Long getConsumerId() {
        return consumerId;
    }

    public void setConsumerId(Long consumerId) {
        this.consumerId = consumerId;
    }

    public String getConsumerName() {
        return consumerName;
    }

    public void setConsumerName(String consumerName) {
        this.consumerName = consumerName;
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

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
