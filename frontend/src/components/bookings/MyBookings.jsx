import React, { useState, useEffect } from 'react';
import bookingApi from '../../services/bookingApi';
import reviewApi from '../../services/reviewApi';
import ReviewForm from '../reviews/ReviewForm';
import ReviewList from '../reviews/ReviewList';
import './bookings.css';

const MyBookings = ({ userId, userType }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [bookingReviews, setBookingReviews] = useState({});

    useEffect(() => {
        loadBookings();
    }, [userId, userType]);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const bookingsData = userType === 'PROVIDER' 
                ? await bookingApi.getProviderBookings(userId)
                : await bookingApi.getConsumerBookings(userId);
            setBookings(bookingsData);
            
            // Load reviews for completed bookings
            const reviewPromises = bookingsData
                .filter(booking => booking.status === 'COMPLETED')
                .map(booking => loadBookingReview(booking.id));
            
            await Promise.all(reviewPromises);
            setError('');
        } catch (err) {
            setError('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const loadBookingReview = async (bookingId) => {
        try {
            const review = await reviewApi.getReviewByBooking(bookingId);
            setBookingReviews(prev => ({
                ...prev,
                [bookingId]: review
            }));
        } catch (err) {
            // No review exists yet
            setBookingReviews(prev => ({
                ...prev,
                [bookingId]: null
            }));
        }
    };

    const handleCancel = async (bookingId) => {
        const message = userType === 'PROVIDER' 
            ? 'Are you sure you want to reject this booking request?'
            : 'Are you sure you want to cancel this booking?';

        if (!window.confirm(message)) {
            return;
        }

        try {
            await bookingApi.cancelBooking(bookingId);
            await loadBookings();
        } catch (err) {
            setError(userType === 'PROVIDER' 
                ? 'Failed to reject booking'
                : 'Failed to cancel booking'
            );
        }
    };

    const handleConfirm = async (bookingId) => {
        try {
            await bookingApi.confirmBooking(bookingId);
            await loadBookings();
        } catch (err) {
            setError('Failed to accept booking');
        }
    };

    const handleComplete = async (bookingId) => {
        try {
            await bookingApi.completeBooking(bookingId);
            await loadBookings();
        } catch (err) {
            setError('Failed to complete booking');
        }
    };

    const handleWriteReview = (booking) => {
        setSelectedBooking(booking);
        setShowReviewForm(true);
    };

    const handleReviewSubmitted = async () => {
        setShowReviewForm(false);
        setSelectedBooking(null);
        await loadBookings();
    };

    const formatDateTime = (dateTimeStr) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateTimeStr).toLocaleString('en-US', options);
    };

    const renderActions = (booking) => {
        const status = booking.status.toUpperCase();

        if (userType === 'PROVIDER') {
            // Provider actions
            switch (status) {
                case 'PENDING':
                    return (
                        <>
                            <button 
                                className="action-button confirm"
                                onClick={() => handleConfirm(booking.id)}
                            >
                                Accept
                            </button>
                            <button 
                                className="action-button reject"
                                onClick={() => handleCancel(booking.id)}
                            >
                                Reject
                            </button>
                        </>
                    );
                case 'CONFIRMED':
                    return (
                        <button 
                            className="action-button complete"
                            onClick={() => handleComplete(booking.id)}
                        >
                            Mark as Complete
                        </button>
                    );
                default:
                    return null;
            }
        } else {
            // Consumer actions
            if (status === 'PENDING') {
                return (
                    <button 
                        className="action-button cancel"
                        onClick={() => handleCancel(booking.id)}
                    >
                        Cancel Booking
                    </button>
                );
            } else if (status === 'COMPLETED' && !bookingReviews[booking.id]) {
                return (
                    <button 
                        className="action-button review"
                        onClick={() => handleWriteReview(booking)}
                    >
                        Write Review
                    </button>
                );
            }
            return null;
        }
    };

    if (loading) {
        return <div className="loading-message">Loading bookings...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (bookings.length === 0) {
        return (
            <div className="no-bookings-message">
                {userType === 'PROVIDER' 
                    ? 'No bookings received yet.'
                    : 'You have no bookings yet. Browse services to make your first booking!'}
            </div>
        );
    }

    if (showReviewForm && selectedBooking) {
        return (
            <ReviewForm 
                consumerId={userId}
                booking={selectedBooking}
                onReviewSubmitted={handleReviewSubmitted}
                onCancel={() => setShowReviewForm(false)}
            />
        );
    }

    return (
        <div className="bookings-container">
            <h2>My Bookings</h2>
            <div className="bookings-list">
                {bookings.map(booking => (
                    <div key={booking.id} className="booking-card">
                        <div className="booking-header">
                            <h3>{booking.serviceName}</h3>
                            <div className={`booking-status ${booking.status.toLowerCase()}`}>
                                {booking.status}
                            </div>
                        </div>

                        <div className="booking-details">
                            {userType === 'PROVIDER' ? (
                                <p><strong>Customer:</strong> {booking.consumerName}</p>
                            ) : (
                                <p><strong>Provider:</strong> {booking.providerName}</p>
                            )}
                            <p><strong>Date & Time:</strong> {formatDateTime(booking.bookingTime)}</p>
                            <p><strong>Amount:</strong> ${booking.amount}</p>
                            {booking.serviceDescription && (
                                <p className="service-description">{booking.serviceDescription}</p>
                            )}
                        </div>

                        <div className="booking-actions">
                            {renderActions(booking)}
                        </div>

                        {booking.status === 'COMPLETED' && bookingReviews[booking.id] && (
                            <div className="booking-review">
                                <h4>Your Review</h4>
                                <ReviewList reviews={[bookingReviews[booking.id]]} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;
