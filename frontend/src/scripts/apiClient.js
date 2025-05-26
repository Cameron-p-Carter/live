const API_BASE = 'http://localhost:8080/api';

export const apiClient = {
    // User endpoints
    register: async (userData) => {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Failed to register user');
        return await response.json();
    },

    // Service endpoints
    createService: async (providerId, serviceData) => {
        const response = await fetch(`${API_BASE}/services/provider/${providerId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
        });
        if (!response.ok) throw new Error('Failed to create service');
        return await response.json();
    },

    // Booking endpoints
    createBooking: async (consumerId, bookingData) => {
        const response = await fetch(`${API_BASE}/bookings/consumer/${consumerId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        if (!response.ok) throw new Error('Failed to create booking');
        return await response.json();
    },

    confirmBooking: async (bookingId) => {
        const response = await fetch(`${API_BASE}/bookings/${bookingId}/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to confirm booking');
        return await response.json();
    },

    completeBooking: async (bookingId) => {
        const response = await fetch(`${API_BASE}/bookings/${bookingId}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to complete booking');
        return await response.json();
    },

    cancelBooking: async (bookingId) => {
        const response = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to cancel booking');
        return await response.json();
    },

    // Review endpoints
    createReview: async (consumerId, reviewData) => {
        const response = await fetch(`${API_BASE}/reviews/consumer/${consumerId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        if (!response.ok) throw new Error('Failed to create review');
        return await response.json();
    },

    // Wallet endpoints
    deposit: async (userId, amount) => {
        const response = await fetch(`${API_BASE}/wallet/${userId}/mock-deposit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        if (!response.ok) throw new Error('Failed to deposit funds');
        return await response.json();
    }
};
