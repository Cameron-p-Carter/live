package com.example.live.booking;

import com.example.live.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Find bookings by consumer
    List<Booking> findByConsumerOrderByBookingTimeDesc(User consumer);
    
    // Find bookings by provider
    List<Booking> findByProviderOrderByBookingTimeDesc(User provider);
    
    // Find pending bookings for provider
    List<Booking> findByProviderAndStatusOrderByBookingTimeAsc(User provider, BookingStatus status);
    
    // Find upcoming bookings for consumer (CONFIRMED status)
    List<Booking> findByConsumerAndStatusOrderByBookingTimeAsc(User consumer, BookingStatus status);
    
    // Find completed bookings with payment status
    List<Booking> findByProviderAndStatusAndPaymentStatusOrderByBookingTimeDesc(
        User provider, BookingStatus status, PaymentStatus paymentStatus);
}
