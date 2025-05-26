const API_BASE = 'http://localhost:8080/api/bookings';

const bookingApi = {
    // Consumer endpoints
    createBooking: async (consumerId, bookingData) => {
        try {
            const response = await fetch(`${API_BASE}/consumer/${consumerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(bookingData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create booking');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    },

    getConsumerBookings: async (consumerId) => {
        try {
            const response = await fetch(`${API_BASE}/consumer/${consumerId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch bookings');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching bookings:', error);
            throw error;
        }
    },

    cancelBooking: async (bookingId) => {
        try {
            const response = await fetch(`${API_BASE}/${bookingId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to cancel booking');
            }
            return await response.json();
        } catch (error) {
            console.error('Error canceling booking:', error);
            throw error;
        }
    },

    // Provider endpoints
    getProviderBookings: async (providerId) => {
        try {
            const response = await fetch(`${API_BASE}/provider/${providerId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch bookings');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching bookings:', error);
            throw error;
        }
    },

    getProviderPendingBookings: async (providerId) => {
        try {
            const response = await fetch(`${API_BASE}/provider/${providerId}/pending`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch pending bookings');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching pending bookings:', error);
            throw error;
        }
    },

    confirmBooking: async (bookingId) => {
        try {
            const response = await fetch(`${API_BASE}/${bookingId}/confirm`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to confirm booking');
            }
            return await response.json();
        } catch (error) {
            console.error('Error confirming booking:', error);
            throw error;
        }
    },

    completeBooking: async (bookingId) => {
        try {
            const response = await fetch(`${API_BASE}/${bookingId}/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to complete booking');
            }
            return await response.json();
        } catch (error) {
            console.error('Error completing booking:', error);
            throw error;
        }
    }
};

export default bookingApi;
