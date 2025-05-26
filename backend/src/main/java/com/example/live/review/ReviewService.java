package com.example.live.review;

import com.example.live.booking.Booking;
import com.example.live.booking.BookingRepository;
import com.example.live.booking.BookingStatus;
import com.example.live.review.dto.CreateReviewRequest;
import com.example.live.review.dto.ProviderStatsResponse;
import com.example.live.review.dto.ReviewResponse;
import com.example.live.user.User;
import com.example.live.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Autowired
    public ReviewService(
            ReviewRepository reviewRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReviewResponse createReview(Long consumerId, CreateReviewRequest request) {
        // Validate request
        request.validate();

        // Get booking
        Booking booking = bookingRepository.findById(request.getBookingId())
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Validate booking belongs to consumer
        if (!booking.getConsumer().getId().equals(consumerId)) {
            throw new RuntimeException("Booking does not belong to this consumer");
        }

        // Validate booking is completed
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot review a booking that is not completed");
        }

        // Check if review already exists
        if (reviewRepository.existsByBooking(booking)) {
            throw new RuntimeException("Review already exists for this booking");
        }

        // Create review
        Review review = new Review();
        review.setBooking(booking);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        review = reviewRepository.save(review);
        return ReviewResponse.fromReview(review);
    }

    public List<ReviewResponse> getConsumerReviews(Long consumerId) {
        User consumer = userRepository.findById(consumerId)
            .orElseThrow(() -> new RuntimeException("Consumer not found"));

        return reviewRepository.findByConsumerOrderByCreatedAtDesc(consumer).stream()
            .map(ReviewResponse::fromReview)
            .collect(Collectors.toList());
    }

    public List<ReviewResponse> getProviderReviews(Long providerId) {
        User provider = userRepository.findById(providerId)
            .orElseThrow(() -> new RuntimeException("Provider not found"));

        return reviewRepository.findByProviderOrderByCreatedAtDesc(provider).stream()
            .map(ReviewResponse::fromReview)
            .collect(Collectors.toList());
    }

    public ProviderStatsResponse getProviderStats(Long providerId) {
        User provider = userRepository.findById(providerId)
            .orElseThrow(() -> new RuntimeException("Provider not found"));

        ProviderStatsResponse stats = new ProviderStatsResponse();

        // Get average rating
        Double averageRating = reviewRepository.calculateAverageRating(provider);
        stats.setAverageRating(averageRating);

        // Get rating distribution
        List<Object[]> distribution = reviewRepository.countReviewsByRating(provider);
        for (Object[] result : distribution) {
            int rating = ((Number) result[0]).intValue();
            int count = ((Number) result[1]).intValue();
            stats.getRatingDistribution().put(rating, count);
        }

        // Calculate total reviews
        int totalReviews = stats.getRatingDistribution().values().stream()
            .mapToInt(Integer::intValue)
            .sum();
        stats.setTotalReviews(totalReviews);

        return stats;
    }

    public ReviewResponse getReviewByBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        Review review = reviewRepository.findByBooking(booking)
            .orElseThrow(() -> new RuntimeException("Review not found for this booking"));

        return ReviewResponse.fromReview(review);
    }
}
