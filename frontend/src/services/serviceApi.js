const API_BASE = 'http://localhost:8080/api/services';
const USER_API_BASE = 'http://localhost:8080/api/users';

const serviceApi = {
    // Provider endpoints
    createService: async (providerId, serviceData) => {
        try {
            const response = await fetch(`${API_BASE}/provider/${providerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(serviceData)
            });
            if (!response.ok) throw new Error('Failed to create service');
            return await response.json();
        } catch (error) {
            console.error('Error creating service:', error);
            throw error;
        }
    },

    getProviderServices: async (providerId) => {
        try {
            const response = await fetch(`${API_BASE}/provider/${providerId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch provider services');
            return await response.json();
        } catch (error) {
            console.error('Error fetching provider services:', error);
            throw error;
        }
    },

    updateService: async (serviceId, serviceData) => {
        try {
            const response = await fetch(`${API_BASE}/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(serviceData)
            });
            if (!response.ok) throw new Error('Failed to update service');
            return await response.json();
        } catch (error) {
            console.error('Error updating service:', error);
            throw error;
        }
    },

    deleteService: async (serviceId) => {
        try {
            const response = await fetch(`${API_BASE}/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete service');
            return await response.text();
        } catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    },

    toggleServiceStatus: async (serviceId) => {
        try {
            const response = await fetch(`${API_BASE}/${serviceId}/toggle`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to toggle service status');
            return await response.json();
        } catch (error) {
            console.error('Error toggling service status:', error);
            throw error;
        }
    },

    // Consumer endpoints
    getAllActiveServices: async () => {
        try {
            const response = await fetch(API_BASE);
            if (!response.ok) throw new Error('Failed to fetch services');
            return await response.json();
        } catch (error) {
            console.error('Error fetching services:', error);
            throw error;
        }
    },

    getServiceById: async (serviceId) => {
        try {
            const response = await fetch(`${API_BASE}/${serviceId}`);
            if (!response.ok) throw new Error('Failed to fetch service');
            return await response.json();
        } catch (error) {
            console.error('Error fetching service:', error);
            throw error;
        }
    },

    searchByCategory: async (category) => {
        try {
            const response = await fetch(`${API_BASE}/category/${category}`);
            if (!response.ok) throw new Error('Failed to search services by category');
            return await response.json();
        } catch (error) {
            console.error('Error searching services by category:', error);
            throw error;
        }
    },

    searchByLocation: async (location) => {
        try {
            const response = await fetch(`${API_BASE}/search?location=${encodeURIComponent(location)}`);
            if (!response.ok) throw new Error('Failed to search services by location');
            return await response.json();
        } catch (error) {
            console.error('Error searching services by location:', error);
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await fetch(`${API_BASE}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Provider profile
    getProviderProfile: async (providerId) => {
        try {
            const response = await fetch(`${USER_API_BASE}/${providerId}`);
            if (!response.ok) throw new Error('Failed to fetch provider profile');
            return await response.json();
        } catch (error) {
            console.error('Error fetching provider profile:', error);
            throw error;
        }
    }
};

export default serviceApi;
