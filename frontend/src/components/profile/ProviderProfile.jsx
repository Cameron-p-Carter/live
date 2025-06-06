import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import serviceApi from '../../services/serviceApi';
import reviewApi from '../../services/reviewApi';
import ReviewList from '../reviews/ReviewList';
import ProviderStats from '../reviews/ProviderStats';
import './Profile.css';

const ProviderProfile = () => {
    const { providerId } = useParams();
    const [provider, setProvider] = useState(null);
    const [services, setServices] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (providerId) {
            loadProviderData();
        }
    }, [providerId]);

    const loadProviderData = async () => {
        try {
            setLoading(true);
            const [providerData, servicesData, reviewsData, statsData] = await Promise.all([
                serviceApi.getProviderProfile(providerId),
                serviceApi.getProviderServices(providerId),
                reviewApi.getProviderReviews(providerId),
                reviewApi.getProviderStats(providerId)
            ]);
            setProvider(providerData);
            setServices(servicesData.filter(service => service.active));
            setReviews(reviewsData);
            setStats(statsData);
            setError('');
        } catch (err) {
            setError('Failed to load provider profile');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleBookService = (serviceId) => {
        navigate(`/services/book/${serviceId}`);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="provider-profile-page">
                    <div className="profile-loading">Loading profile...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="provider-profile-page">
                    <div className="profile-error">{error}</div>
                </div>
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="page-container">
                <div className="provider-profile-page">
                    <div className="profile-error">Provider not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="provider-profile-page">
                <button className="back-button" onClick={handleBack}>&larr; Back</button>
                
                <div className="profile-header">
                    <h2>{provider.firstName} {provider.lastName}</h2>
                    {provider.businessName && (
                        <h3 className="business-name">{provider.businessName}</h3>
                    )}
                    <div className="provider-info">
                        <p className="provider-location">{provider.location}</p>
                        {provider.bio && (
                            <p className="provider-bio">{provider.bio}</p>
                        )}
                        {provider.serviceDescription && (
                            <p className="service-description">{provider.serviceDescription}</p>
                        )}
                    </div>
                </div>

                {stats && <ProviderStats stats={stats} />}

                <div className="provider-services">
                    <h3>Services Offered</h3>
                    <div className="service-list">
                        {services.map(service => (
                            <div key={service.id} className="service-card">
                                <h4>{service.title}</h4>
                                <div className="price">${service.price}</div>
                                <div className="category">{service.category.replace('_', ' ')}</div>
                                <div className="service-details">
                                    <p><strong>Duration:</strong> {service.estimatedDuration}</p>
                                    <p><strong>Area:</strong> {service.serviceArea}</p>
                                    {service.description && (
                                        <p className="description">{service.description}</p>
                                    )}
                                </div>
                                <button 
                                    className="book-button"
                                    onClick={() => handleBookService(service.id)}
                                >
                                    Book Service
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="provider-reviews">
                    <h3>Reviews</h3>
                    <ReviewList reviews={reviews} />
                </div>
            </div>
        </div>
    );
};

export default ProviderProfile;
