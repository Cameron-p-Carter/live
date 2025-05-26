package com.example.live.payment;

public enum TransactionType {
    DEPOSIT("Money added to wallet"),
    WITHDRAWAL("Money withdrawn from wallet"),
    PAYMENT("Payment sent for service"),
    PAYMENT_RECEIVED("Payment received for service"),
    REFUND("Refund issued for cancelled service"),
    REFUND_RECEIVED("Refund received for cancelled service");

    private final String description;

    TransactionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
