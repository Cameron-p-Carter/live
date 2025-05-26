const API_BASE = 'http://localhost:8080/api/users';

// Singleton pattern - we only need one instance of auth service
const authService = {
    // Login user
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) throw new Error('Login failed');
            const loginData = await response.json();
            
            // After successful login, fetch user details
            const userResponse = await fetch(`${API_BASE}/${loginData.userId}`);
            if (!userResponse.ok) throw new Error('Failed to fetch user details');
            const userData = await userResponse.json();
            
            // Store token and return user data
            localStorage.setItem('token', loginData.token);
            return userData;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },

    // Register user
    register: async (userData) => {
        try {
            const response = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) throw new Error('Registration failed');
            return await response.json();
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
    },

    // Check if user is logged in
    isLoggedIn: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService;
