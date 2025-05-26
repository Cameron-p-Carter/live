const API_BASE = 'http://localhost:8080/api/reviews';

const reviewApi = {
    // Create a new review
    createReview: async (consumerId, data) => {
        try {
            const response = await fetch(`${API_BASE}/consumer/${consumerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create review');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    // Get reviews for a consumer
    getConsumerReviews: async (consumerId) => {
        try {
            const response = await fetch(`${API_BASE}/consumer/${consumerId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch consumer reviews');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching consumer reviews:', error);
            throw error;
        }
    },

    // Get reviews for a provider
    getProviderReviews: async (providerId) => {
        try {
            const response = await fetch(`${API_BASE}/provider/${providerId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch provider reviews');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching provider reviews:', error);
            throw error;
        }
    },

    // Get provider statistics
    getProviderStats: async (providerId) => {
        try {
            const response = await fetch(`${API_BASE}/provider/${providerId}/stats`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch provider stats');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching provider stats:', error);
            throw error;
        }
    },

    // Get review for a specific booking
    getReviewByBooking: async (bookingId) => {
        try {
            const response = await fetch(`${API_BASE}/booking/${bookingId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch booking review');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching booking review:', error);
            throw error;
        }
    }
};

export default reviewApi;
