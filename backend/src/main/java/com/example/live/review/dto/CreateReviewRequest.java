package com.example.live.review.dto;

import com.example.live.review.Rating;

public class CreateReviewRequest {
    private Long bookingId;
    private int rating;
    private String comment;

    // Default constructor for JSON deserialization
    public CreateReviewRequest() {}

    // Getters and Setters with validation
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        if (bookingId == null) {
            throw new IllegalArgumentException("Booking ID is required");
        }
        this.bookingId = bookingId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        Rating.validate(rating);
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        // Comment is optional, but if provided should not be empty
        if (comment != null && comment.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment cannot be empty if provided");
        }
        this.comment = comment;
    }

    // Validation method
    public void validate() {
        if (bookingId == null) {
            throw new IllegalStateException("Booking ID is required");
        }
        Rating.validate(rating);
        if (comment != null && comment.trim().isEmpty()) {
            throw new IllegalStateException("Comment cannot be empty if provided");
        }
    }
}
