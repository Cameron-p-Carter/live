import React, { useState, useEffect } from 'react';
import bookingApi from '../../services/bookingApi';
import reviewApi from '../../services/reviewApi';
import ReviewList from '../reviews/ReviewList';
import ProviderStats from '../reviews/ProviderStats';
import './services.css';

const BookService = ({ service, consumerId, onBookingComplete, onCancel }) => {
    const [bookingTime, setBookingTime] = useState('');
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReviews();
    }, [service.providerId]);

    const loadReviews = async () => {
        try {
            const [reviewsData, statsData] = await Promise.all([
                reviewApi.getProviderReviews(service.providerId),
                reviewApi.getProviderStats(service.providerId)
            ]);
            setReviews(reviewsData);
            setStats(statsData);
        } catch (err) {
            console.error('Failed to load reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get min date (today) and max date (3 months from now) for the datetime picker
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    const minDateTime = today.toISOString().slice(0, 16);
    const maxDateTime = maxDate.toISOString().slice(0, 16);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!bookingTime) {
            setError('Please select a booking time');
            return;
        }

        try {
            const bookingData = {
                serviceId: service.id,
                bookingTime: bookingTime
            };

            const response = await bookingApi.createBooking(consumerId, bookingData);
            onBookingComplete(response);
        } catch (err) {
            setError(err.message || 'Failed to create booking');
        }
    };

    return (
        <div className="booking-page">
            <div className="booking-form-container">
                <h2>Book Service</h2>
                
                <div className="service-summary">
                    <h3>{service.title}</h3>
                    <p className="price">${service.price}</p>
                    <p><strong>Provider:</strong> {service.providerName}</p>
                    <p><strong>Duration:</strong> {service.estimatedDuration}</p>
                    <p><strong>Area:</strong> {service.serviceArea}</p>
                    {service.description && (
                        <p className="description">{service.description}</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                        <label>Select Date and Time:</label>
                        <input
                            type="datetime-local"
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            min={minDateTime}
                            max={maxDateTime}
                            required
                        />
                        <small className="form-help">
                            Please select a date and time within the next 3 months
                        </small>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="button-group">
                        <button type="button" className="cancel-button" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </div>

            <div className="service-reviews">
                <h3>Provider Reviews</h3>
                {loading ? (
                    <div className="loading-message">Loading reviews...</div>
                ) : (
                    <>
                        {stats && <ProviderStats stats={stats} />}
                        <div className="reviews-section">
                            {reviews.length > 0 ? (
                                <ReviewList reviews={reviews} />
                            ) : (
                                <p className="no-reviews-message">No reviews yet</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookService;
