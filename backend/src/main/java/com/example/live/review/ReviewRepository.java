package com.example.live.review;

import com.example.live.booking.Booking;
import com.example.live.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Find review by booking
    Optional<Review> findByBooking(Booking booking);
    
    // Find reviews by consumer
    List<Review> findByConsumerOrderByCreatedAtDesc(User consumer);
    
    // Find reviews by provider
    List<Review> findByProviderOrderByCreatedAtDesc(User provider);
    
    // Calculate average rating for provider
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.provider = :provider")
    Double calculateAverageRating(@Param("provider") User provider);
    
    // Count reviews by rating for provider
    @Query("SELECT r.rating, COUNT(r) FROM Review r " +
           "WHERE r.provider = :provider GROUP BY r.rating")
    List<Object[]> countReviewsByRating(@Param("provider") User provider);
    
    // Check if booking already has a review
    boolean existsByBooking(Booking booking);
}
