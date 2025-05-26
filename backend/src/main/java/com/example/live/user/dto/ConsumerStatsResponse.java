package com.example.live.user.dto;

public class ConsumerStatsResponse {
    private Long completedOrders;
    private Double totalSpend;

    public ConsumerStatsResponse(Long completedOrders, Double totalSpend) {
        this.completedOrders = completedOrders;
        this.totalSpend = totalSpend;
    }

    public Long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(Long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public Double getTotalSpend() {
        return totalSpend;
    }

    public void setTotalSpend(Double totalSpend) {
        this.totalSpend = totalSpend;
    }
}
