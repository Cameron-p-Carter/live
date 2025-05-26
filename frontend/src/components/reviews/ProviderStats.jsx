import React from 'react';
import './reviews.css';

const ProviderStats = ({ stats }) => {
    const renderStars = (rating) => {
        const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
        return (
            <div className="star-display large">
                {[1, 2, 3, 4, 5].map((star) => {
                    let starClass = 'empty';
                    if (star <= roundedRating) {
                        starClass = 'filled';
                    } else if (star - 0.5 <= roundedRating) {
                        starClass = 'half-filled';
                    }
                    return (
                        <span key={star} className={`star ${starClass}`}>
                            ★
                        </span>
                    );
                })}
            </div>
        );
    };

    const calculatePercentage = (count) => {
        if (!stats.totalReviews) return 0;
        return (count / stats.totalReviews) * 100;
    };

    if (!stats) {
        return <div className="provider-stats loading">Loading stats...</div>;
    }

    return (
        <div className="provider-stats">
            <div className="stats-header">
                <div className="average-rating">
                    <div className="rating-number">
                        {stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
                    </div>
                    {stats.averageRating && renderStars(stats.averageRating)}
                </div>
                <div className="total-reviews">
                    {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </div>
            </div>

            <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((rating) => {
                    const count = stats.ratingDistribution[rating] || 0;
                    const percentage = calculatePercentage(count);
                    
                    return (
                        <div key={rating} className="distribution-row">
                            <div className="rating-label">{rating} stars</div>
                            <div className="distribution-bar-container">
                                <div 
                                    className="distribution-bar"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <div className="rating-count">
                                {count}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProviderStats;
