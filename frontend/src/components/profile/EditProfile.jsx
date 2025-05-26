import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../services/userApi';
import './Profile.css';

const EditProfile = ({ user, onUpdateSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        location: user.location || '',
        businessName: user.businessName || '',
        serviceArea: user.serviceArea || '',
        serviceDescription: user.serviceDescription || '',
        bio: user.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [showPasswordSection, setShowPasswordSection] = useState(false);

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
            // Update profile information
            const profileData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                location: formData.location
            };

            if (user.userType === 'PROVIDER') {
                profileData.businessName = formData.businessName;
                profileData.serviceArea = formData.serviceArea;
                profileData.serviceDescription = formData.serviceDescription;
                profileData.bio = formData.bio;
            }

            const updatedUser = await userApi.updateUser(user.id, profileData);

            // If password section is shown and new password is provided
            if (showPasswordSection && formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    setError('New passwords do not match');
                    return;
                }

                if (formData.newPassword.length < 6) {
                    setError('New password must be at least 6 characters');
                    return;
                }

                await userApi.changePassword(user.id, {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword // Include confirmPassword in request
                });
            }

            // Pass the updated user data to parent component
            onUpdateSuccess({
                ...user,
                ...updatedUser
            });
            navigate('/profile');
        } catch (err) {
            if (err.message === 'Current password is incorrect') {
                setError('Current password is incorrect');
            } else {
                setError(err.message || 'Failed to update profile');
            }
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    return (
        <div className="page-container">
            <div className="user-profile-page">
                <div className="profile-header">
                    <h2>Edit Profile</h2>
                </div>

                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <div className="profile-section">
                        <h3>Personal Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {user.userType === 'PROVIDER' && (
                        <div className="profile-section">
                            <h3>Provider Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Business Name</label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Service Area</label>
                                    <input
                                        type="text"
                                        name="serviceArea"
                                        value={formData.serviceArea}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Service Description</label>
                                    <textarea
                                        name="serviceDescription"
                                        value={formData.serviceDescription}
                                        onChange={handleChange}
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="profile-section">
                        <div className="password-header">
                            <h3>Password</h3>
                            <button 
                                type="button"
                                className="toggle-button"
                                onClick={() => setShowPasswordSection(!showPasswordSection)}
                            >
                                {showPasswordSection ? 'Cancel Password Change' : 'Change Password'}
                            </button>
                        </div>

                        {showPasswordSection && (
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        required={showPasswordSection}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required={showPasswordSection}
                                        minLength={6}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required={showPasswordSection}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="button-group">
                        <button type="button" className="cancel-button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="save-button">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
