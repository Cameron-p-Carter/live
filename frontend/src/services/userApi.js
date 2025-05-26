const API_BASE = 'http://localhost:8080/api/users';

const userApi = {
    updateUser: async (userId, userData) => {
        try {
            const response = await fetch(`${API_BASE}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update user');
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    changePassword: async (userId, passwordData) => {
        try {
            const response = await fetch(`${API_BASE}/${userId}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(passwordData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }
            if (!data.success) {
                throw new Error(data.message || 'Failed to change password');
            }
            return data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    },

    getUserById: async (userId) => {
        try {
            const response = await fetch(`${API_BASE}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch user');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }
};

export default userApi;
