import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import serviceApi from '../../services/serviceApi';
import './services.css';

const ConsumerServices = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadCategories();
        loadServices();
    }, []);

    const loadCategories = async () => {
        try {
            const categoriesData = await serviceApi.getCategories();
            setCategories(categoriesData);
        } catch (err) {
            setError('Failed to load categories');
        }
    };

    const loadServices = async () => {
        try {
            setLoading(true);
            const servicesData = await serviceApi.getAllActiveServices();
            setServices(servicesData);
            setError('');
        } catch (err) {
            setError('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = async (category) => {
        try {
            setLoading(true);
            setSelectedCategory(category);
            if (category) {
                const servicesData = await serviceApi.searchByCategory(category);
                setServices(servicesData);
            } else {
                await loadServices();
            }
            setError('');
        } catch (err) {
            setError('Failed to filter services');
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSearch = async () => {
        if (!location.trim()) {
            await loadServices();
            return;
        }

        try {
            setLoading(true);
            const servicesData = await serviceApi.searchByLocation(location);
            setServices(servicesData);
            setError('');
        } catch (err) {
            setError('Failed to search services by location');
        } finally {
            setLoading(false);
        }
    };

    const handleProviderClick = (providerId) => {
        navigate(`/provider/${providerId}`);
    };

    return (
        <div className="consumer-services">
            <div className="services-filters">
                <div className="filter-group">
                    <select 
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="category-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location..."
                        className="location-input"
                    />
                    <button 
                        onClick={handleLocationSearch}
                        className="search-button"
                    >
                        Search
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading-message">Loading services...</div>
            ) : services.length === 0 ? (
                <div className="no-services-message">No services found</div>
            ) : (
                <div className="service-list">
                    {services.map(service => (
                        <div key={service.id} className="service-card">
                            <h3>{service.title}</h3>
                            <div 
                                className="provider-name"
                                onClick={() => handleProviderClick(service.providerId)}
                            >
                                by {service.providerName}
                            </div>
                            <div className="price">${service.price}</div>
                            <div className="category">{service.category.replace('_', ' ')}</div>
                            <div className="service-details">
                                <p><strong>Duration:</strong> {service.estimatedDuration}</p>
                                <p><strong>Area:</strong> {service.serviceArea}</p>
                                {service.description && (
                                    <p className="description">{service.description}</p>
                                )}
                            </div>
                            <button className="book-button">Book Service</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConsumerServices;
