import React, { useState } from 'react';
import authService from '../services/auth';
import './auth.css';

// Simple Login component using the Facade pattern - provides a simple interface to the complex authentication system
const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const userData = await authService.login(formData);
            // Pass all user data to parent component
            onLoginSuccess({
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                location: userData.location,
                profilePicture: userData.profilePicture,
                bio: userData.bio,
                userType: userData.userType,
                businessName: userData.businessName,
                serviceArea: userData.serviceArea,
                serviceDescription: userData.serviceDescription,
                rating: userData.rating,
                totalBookings: userData.totalBookings
            });
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="auth-button">Login</button>
            </form>
        </div>
    );
};

export default Login;
