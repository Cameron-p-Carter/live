package com.example.live.booking;

import com.example.live.booking.dto.BookingResponse;
import com.example.live.booking.dto.CreateBookingRequest;
import com.example.live.payment.PaymentService;
import com.example.live.service.ServiceRepository;
import com.example.live.user.User;
import com.example.live.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final PaymentService paymentService;

    @Autowired
    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ServiceRepository serviceRepository,
            PaymentService paymentService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.paymentService = paymentService;
    }

    @Transactional
    public BookingResponse createBooking(Long consumerId, CreateBookingRequest request) {
        // Validate request
        request.validate();

        // Get consumer
        User consumer = userRepository.findById(consumerId)
            .orElseThrow(() -> new RuntimeException("Consumer not found"));

        // Get service and provider
        com.example.live.service.Service service = serviceRepository.findById(request.getServiceId())
            .orElseThrow(() -> new RuntimeException("Service not found"));

        if (!service.isActive()) {
            throw new RuntimeException("Service is not currently available");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setConsumer(consumer);
        booking.setProvider(service.getProvider());
        booking.setService(service);
        booking.setBookingTime(request.getBookingTime());
        booking.setAmount(service.getPrice());
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.PENDING);

        booking = bookingRepository.save(booking);

        // Process payment
        boolean paymentSuccess = paymentService.processPayment(booking);
        if (paymentSuccess) {
            booking.setPaymentStatus(PaymentStatus.PAID);
            booking.setStatus(BookingStatus.CONFIRMED);
            booking = bookingRepository.save(booking);
        } else {
            booking.setPaymentStatus(PaymentStatus.FAILED);
            booking = bookingRepository.save(booking);
            throw new RuntimeException("Payment failed - insufficient funds");
        }

        return BookingResponse.fromBooking(booking);
    }

    public List<BookingResponse> getConsumerBookings(Long consumerId) {
        User consumer = userRepository.findById(consumerId)
            .orElseThrow(() -> new RuntimeException("Consumer not found"));

        return bookingRepository.findByConsumerOrderByBookingTimeDesc(consumer).stream()
            .map(BookingResponse::fromBooking)
            .collect(Collectors.toList());
    }

    public List<BookingResponse> getProviderBookings(Long providerId) {
        User provider = userRepository.findById(providerId)
            .orElseThrow(() -> new RuntimeException("Provider not found"));

        return bookingRepository.findByProviderOrderByBookingTimeDesc(provider).stream()
            .map(BookingResponse::fromBooking)
            .collect(Collectors.toList());
    }

    public List<BookingResponse> getProviderPendingBookings(Long providerId) {
        User provider = userRepository.findById(providerId)
            .orElseThrow(() -> new RuntimeException("Provider not found"));

        return bookingRepository.findByProviderAndStatusOrderByBookingTimeAsc(provider, BookingStatus.PENDING).stream()
            .map(BookingResponse::fromBooking)
            .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.canConfirm()) {
            throw new RuntimeException("Booking cannot be confirmed in its current state");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);
        return BookingResponse.fromBooking(booking);
    }

    @Transactional
    public BookingResponse completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.canComplete()) {
            throw new RuntimeException("Booking cannot be completed in its current state");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        booking = bookingRepository.save(booking);
        return BookingResponse.fromBooking(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.canCancel()) {
            throw new RuntimeException("Booking cannot be cancelled in its current state");
        }

        // Process refund if payment was made
        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            boolean refundSuccess = paymentService.processRefund(booking);
            if (refundSuccess) {
                booking.setPaymentStatus(PaymentStatus.REFUNDED);
            } else {
                throw new RuntimeException("Refund failed - provider has insufficient funds");
            }
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);
        return BookingResponse.fromBooking(booking);
    }
}
