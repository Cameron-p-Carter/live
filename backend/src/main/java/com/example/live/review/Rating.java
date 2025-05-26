package com.example.live.review;

public class Rating {
    public static final int MIN_RATING = 1;
    public static final int MAX_RATING = 5;

    public static void validate(int rating) {
        if (rating < MIN_RATING || rating > MAX_RATING) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
    }
}
