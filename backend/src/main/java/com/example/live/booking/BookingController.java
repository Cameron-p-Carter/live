package com.example.live.booking;

import com.example.live.booking.dto.BookingResponse;
import com.example.live.booking.dto.CreateBookingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Consumer endpoints
    @PostMapping("/consumer/{consumerId}")
    public ResponseEntity<BookingResponse> createBooking(
            @PathVariable Long consumerId,
            @RequestBody CreateBookingRequest request) {
        BookingResponse booking = bookingService.createBooking(consumerId, request);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/consumer/{consumerId}")
    public ResponseEntity<List<BookingResponse>> getConsumerBookings(@PathVariable Long consumerId) {
        List<BookingResponse> bookings = bookingService.getConsumerBookings(consumerId);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long bookingId) {
        BookingResponse booking = bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(booking);
    }

    // Provider endpoints
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<BookingResponse>> getProviderBookings(@PathVariable Long providerId) {
        List<BookingResponse> bookings = bookingService.getProviderBookings(providerId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/provider/{providerId}/pending")
    public ResponseEntity<List<BookingResponse>> getProviderPendingBookings(@PathVariable Long providerId) {
        List<BookingResponse> bookings = bookingService.getProviderPendingBookings(providerId);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/{bookingId}/confirm")
    public ResponseEntity<BookingResponse> confirmBooking(@PathVariable Long bookingId) {
        BookingResponse booking = bookingService.confirmBooking(bookingId);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/{bookingId}/complete")
    public ResponseEntity<BookingResponse> completeBooking(@PathVariable Long bookingId) {
        BookingResponse booking = bookingService.completeBooking(bookingId);
        return ResponseEntity.ok(booking);
    }
}
