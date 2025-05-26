import React, { useState, useEffect } from 'react';
import bookingApi from '../../services/bookingApi';
import './bookings.css';

const MyBookings = ({ userId, userType }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            setError('');
        } catch (err) {
            setError('Failed to load bookings');
        } finally {
            setLoading(false);
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

    const formatDateTime = (dateTimeStr) => {
        // Create a date object from the UTC string
        const date = new Date(dateTimeStr);
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short'
        };
        return date.toLocaleString('en-US', options);
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;
