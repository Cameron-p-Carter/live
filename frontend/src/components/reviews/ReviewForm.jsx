import React, { useState } from 'react';
import reviewApi from '../../services/reviewApi';
import './reviews.css';

const ReviewForm = ({ consumerId, booking, onReviewSubmitted, onCancel }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const reviewData = {
                bookingId: booking.id,
                rating,
                comment: comment.trim() || null // Send null if comment is empty
            };

            await reviewApi.createReview(consumerId, reviewData);
            onReviewSubmitted();
        } catch (err) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-form-container">
            <h3>Write a Review</h3>
            <p className="service-info">
                Service: {booking.serviceName}<br />
                Provider: {booking.providerName}
            </p>

            <form onSubmit={handleSubmit} className="review-form">
                <div className="rating-input">
                    <label>Rating:</label>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`star-button ${star <= rating ? 'selected' : ''}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Comment (optional):</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience..."
                        rows={4}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="button-group">
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
