import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const UserProfile = ({ user }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate('/profile/edit');
    };

    return (
        <div className="page-container">
            <div className="user-profile-page">
                <div className="profile-header">
                    <h2>My Profile</h2>
                    <button className="edit-button" onClick={handleEdit}>Edit Profile</button>
                </div>

                <div className="profile-section">
                    <h3>Personal Information</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>First Name</label>
                            <p>{user.firstName}</p>
                        </div>
                        <div className="info-item">
                            <label>Last Name</label>
                            <p>{user.lastName}</p>
                        </div>
                        <div className="info-item">
                            <label>Email</label>
                            <p>{user.email}</p>
                        </div>
                        <div className="info-item">
                            <label>Phone Number</label>
                            <p>{user.phoneNumber || 'Not provided'}</p>
                        </div>
                        <div className="info-item">
                            <label>Location</label>
                            <p>{user.location || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {user.userType === 'PROVIDER' && (
                    <>
                        <div className="profile-section">
                            <h3>Provider Information</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Business Name</label>
                                    <p>{user.businessName || 'Not provided'}</p>
                                </div>
                                <div className="info-item">
                                    <label>Service Area</label>
                                    <p>{user.serviceArea || 'Not provided'}</p>
                                </div>
                                <div className="info-item full-width">
                                    <label>Service Description</label>
                                    <p>{user.serviceDescription || 'Not provided'}</p>
                                </div>
                                <div className="info-item full-width">
                                    <label>Bio</label>
                                    <p>{user.bio || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3>Statistics</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-value">{user.rating || 'N/A'}</span>
                                    <span className="stat-label">Rating</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{user.totalBookings || 0}</span>
                                    <span className="stat-label">Jobs Completed</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
