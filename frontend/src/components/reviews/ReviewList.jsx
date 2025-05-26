import React from 'react';
import './reviews.css';

const ReviewList = ({ reviews }) => {
    const formatDateTime = (dateTimeStr) => {
        // Create a date object in UTC
        const utcDate = new Date(dateTimeStr);
        
        // Convert to Sydney time by adding the offset
        const sydneyOffset = 10; // Sydney is UTC+10
        const sydneyDate = new Date(utcDate.getTime() + (sydneyOffset * 60 * 60 * 1000));
        
        // Format the date
        const formatter = new Intl.DateTimeFormat('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Australia/Sydney'
        });
        
        return formatter.format(sydneyDate);
    };

    const renderStars = (rating) => {
        return (
            <div className="star-display">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                        key={star} 
                        className={`star ${star <= rating ? 'filled' : 'empty'}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (!reviews || reviews.length === 0) {
        return <p className="no-reviews">No reviews yet</p>;
    }

    return (
        <div className="review-list">
            {reviews.map(review => (
                <div key={review.id} className="review-item">
                    <div className="review-header">
                        <div className="review-rating">
                            {renderStars(review.rating)}
                        </div>
                        <div className="review-meta">
                            <span className="reviewer-name">
                                {review.consumerName}
                            </span>
                            <span className="review-date">
                                {formatDateTime(review.createdAt)}
                            </span>
                        </div>
                    </div>
                    
                    <div className="review-service">
                        Service: {review.serviceName}
                    </div>

                    {review.comment && (
                        <div className="review-comment">
                            {review.comment}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
