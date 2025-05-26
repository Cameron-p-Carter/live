package com.example.live.review.dto;

import java.util.HashMap;
import java.util.Map;

public class ProviderStatsResponse {
    private Double averageRating;
    private Integer totalReviews;
    private Map<Integer, Integer> ratingDistribution;  // Map<rating, count>

    public ProviderStatsResponse() {
        this.ratingDistribution = new HashMap<>();
        // Initialize counts for all ratings to 0
        for (int i = 1; i <= 5; i++) {
            this.ratingDistribution.put(i, 0);
        }
    }

    // Getters and Setters
    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Map<Integer, Integer> getRatingDistribution() {
        return ratingDistribution;
    }

    public void setRatingDistribution(Map<Integer, Integer> ratingDistribution) {
        this.ratingDistribution = ratingDistribution;
    }

    // Helper method to update rating distribution
    public void addRating(int rating) {
        ratingDistribution.merge(rating, 1, Integer::sum);
    }

    // Helper method to get percentage for a specific rating
    public double getPercentageForRating(int rating) {
        if (totalReviews == null || totalReviews == 0) {
            return 0.0;
        }
        Integer count = ratingDistribution.getOrDefault(rating, 0);
        return (count * 100.0) / totalReviews;
    }
}
