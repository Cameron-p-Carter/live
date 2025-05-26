package com.example.live.user.dto;

public class ProviderStatsResponse {
    private Long completedOrders;
    private Long pendingOrders;
    private Long cancelledOrders;
    private Long confirmedOrders;
    private Long totalReviews;
    private Double averageRating;
    private Double totalRevenue;

    public ProviderStatsResponse(
            Long completedOrders,
            Long pendingOrders,
            Long cancelledOrders,
            Long confirmedOrders,
            Long totalReviews,
            Double averageRating,
            Double totalRevenue) {
        this.completedOrders = completedOrders;
        this.pendingOrders = pendingOrders;
        this.cancelledOrders = cancelledOrders;
        this.confirmedOrders = confirmedOrders;
        this.totalReviews = totalReviews;
        this.averageRating = averageRating;
        this.totalRevenue = totalRevenue;
    }

    public Long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(Long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public Long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public Long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(Long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public Long getConfirmedOrders() {
        return confirmedOrders;
    }

    public void setConfirmedOrders(Long confirmedOrders) {
        this.confirmedOrders = confirmedOrders;
    }

    public Long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
