package com.example.live.booking.dto;

import com.example.live.booking.Booking;
import com.example.live.booking.BookingStatus;
import com.example.live.booking.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {
    private Long id;
    private Long serviceId;
    private String serviceName;
    private String serviceDescription;
    
    // Consumer details
    private Long consumerId;
    private String consumerName;
    private String consumerEmail;
    
    // Provider details
    private Long providerId;
    private String providerName;
    private String providerEmail;
    
    private LocalDateTime bookingTime;
    private BigDecimal amount;
    private BookingStatus status;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Factory Method Pattern: Creates BookingResponse from Booking entity
    public static BookingResponse fromBooking(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        
        // Service details
        response.setServiceId(booking.getService().getId());
        response.setServiceName(booking.getService().getTitle());
        response.setServiceDescription(booking.getService().getDescription());
        
        // Consumer details
        response.setConsumerId(booking.getConsumer().getId());
        response.setConsumerName(booking.getConsumer().getFirstName() + " " + booking.getConsumer().getLastName());
        response.setConsumerEmail(booking.getConsumer().getEmail());
        
        // Provider details
        response.setProviderId(booking.getProvider().getId());
        response.setProviderName(booking.getProvider().getFirstName() + " " + booking.getProvider().getLastName());
        response.setProviderEmail(booking.getProvider().getEmail());
        
        // Booking details
        response.setBookingTime(booking.getBookingTime());
        response.setAmount(booking.getAmount());
        response.setStatus(booking.getStatus());
        response.setPaymentStatus(booking.getPaymentStatus());
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());
        
        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getServiceDescription() {
        return serviceDescription;
    }

    public void setServiceDescription(String serviceDescription) {
        this.serviceDescription = serviceDescription;
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

    public String getConsumerEmail() {
        return consumerEmail;
    }

    public void setConsumerEmail(String consumerEmail) {
        this.consumerEmail = consumerEmail;
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

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
