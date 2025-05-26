import React, { useState } from 'react';
import authService from '../services/auth';
import './auth.css';

// Simple Register component using the Facade pattern - provides a simple interface to the complex registration system
const Register = ({ onRegisterSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        location: '',
        userType: 'CONSUMER',
        // Provider specific fields
        businessName: '',
        serviceArea: '',
        serviceDescription: '',
        bio: ''
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
            const response = await authService.register(formData);
            onRegisterSuccess(response);
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>User Type:</label>
                    <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        required
                    >
                        <option value="CONSUMER">Consumer</option>
                        <option value="PROVIDER">Provider</option>
                    </select>
                </div>

                {/* Provider specific fields */}
                {formData.userType === 'PROVIDER' && (
                    <>
                        <div className="form-group">
                            <label>Business Name:</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Service Area:</label>
                            <input
                                type="text"
                                name="serviceArea"
                                value={formData.serviceArea}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Service Description:</label>
                            <textarea
                                name="serviceDescription"
                                value={formData.serviceDescription}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Bio:</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="auth-button">Register</button>
            </form>
        </div>
    );
};

export default Register;
