package com.example.live.review;

import com.example.live.review.dto.CreateReviewRequest;
import com.example.live.review.dto.ProviderStatsResponse;
import com.example.live.review.dto.ReviewResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Consumer endpoints
    @PostMapping("/consumer/{consumerId}")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Long consumerId,
            @RequestBody CreateReviewRequest request) {
        ReviewResponse review = reviewService.createReview(consumerId, request);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/consumer/{consumerId}")
    public ResponseEntity<List<ReviewResponse>> getConsumerReviews(@PathVariable Long consumerId) {
        List<ReviewResponse> reviews = reviewService.getConsumerReviews(consumerId);
        return ResponseEntity.ok(reviews);
    }

    // Provider endpoints
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ReviewResponse>> getProviderReviews(@PathVariable Long providerId) {
        List<ReviewResponse> reviews = reviewService.getProviderReviews(providerId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/provider/{providerId}/stats")
    public ResponseEntity<ProviderStatsResponse> getProviderStats(@PathVariable Long providerId) {
        ProviderStatsResponse stats = reviewService.getProviderStats(providerId);
        return ResponseEntity.ok(stats);
    }

    // General endpoints
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ReviewResponse> getReviewByBooking(@PathVariable Long bookingId) {
        ReviewResponse review = reviewService.getReviewByBooking(bookingId);
        return ResponseEntity.ok(review);
    }
}
