import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingApi from '../../services/bookingApi';
import reviewApi from '../../services/reviewApi';
import walletApi from '../../services/walletApi';
import './Profile.css';

const UserProfile = ({ user }) => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, [user.id, user.userType]);

    const loadData = async () => {
        try {
            setLoading(true);
            if (user.userType === 'CONSUMER') {
                // Load consumer data
                const [bookingsData, walletData] = await Promise.all([
                    bookingApi.getConsumerBookings(user.id),
                    walletApi.getWallet(user.id)
                ]);

                // Calculate consumer stats
                const completedBookings = bookingsData.filter(b => b.status === 'COMPLETED');
                const totalSpend = walletData.recentTransactions
                    .filter(t => t.type === 'PAYMENT')
                    .reduce((sum, t) => sum + t.amount, 0);

                setStats({
                    completedOrders: completedBookings.length,
                    totalSpend
                });
                setBookings(bookingsData);
            } else {
                // Load provider data
                const [bookingsData, statsData] = await Promise.all([
                    bookingApi.getProviderBookings(user.id),
                    reviewApi.getProviderStats(user.id)
                ]);

                // Calculate provider stats
                const completedBookings = bookingsData.filter(b => b.status === 'COMPLETED');
                const pendingBookings = bookingsData.filter(b => b.status === 'PENDING');
                const cancelledBookings = bookingsData.filter(b => b.status === 'CANCELLED');
                const confirmedBookings = bookingsData.filter(b => b.status === 'CONFIRMED');
                const totalRevenue = completedBookings.reduce((sum, b) => sum + b.amount, 0);

                setStats({
                    completedOrders: completedBookings.length,
                    pendingOrders: pendingBookings.length,
                    cancelledOrders: cancelledBookings.length,
                    confirmedOrders: confirmedBookings.length,
                    totalReviews: statsData.totalReviews,
                    averageRating: statsData.averageRating,
                    totalRevenue
                });
                setBookings(bookingsData);
            }
            setError('');
        } catch (err) {
            setError('Failed to load profile data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate('/profile/edit');
    };

    const formatCurrency = (amount) => {
        return `$${amount.toFixed(2)}`;
    };

    if (loading) {
        return <div className="loading-message">Loading profile...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

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

                {stats && (
                    <div className="profile-section">
                        <h3>Statistics</h3>
                        <div className="stats-grid">
                            {user.userType === 'CONSUMER' ? (
                                <>
                                    <div className="stat-item">
                                        <span className="stat-value">{stats.completedOrders}</span>
                                        <span className="stat-label">Orders Completed</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">{formatCurrency(stats.totalSpend)}</span>
                                        <span className="stat-label">Total Spend</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="stat-item">
                                        <span className="stat-value">{stats.completedOrders}</span>
                                        <span className="stat-label">Completed Orders</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">{stats.pendingOrders}</span>
                                        <span className="stat-label">Pending Orders</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">{stats.confirmedOrders}</span>
                                        <span className="stat-label">Confirmed Orders</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">{stats.cancelledOrders}</span>
                                        <span className="stat-label">Cancelled Orders</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">{stats.totalReviews}</span>
                                        <span className="stat-label">Total Reviews</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">
                                            {stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
                                        </span>
                                        <span className="stat-label">Average Rating</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
                                        <span className="stat-label">Total Revenue</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {user.userType === 'PROVIDER' && (
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
                )}
            </div>
        </div>
    );
};

export default UserProfile;
