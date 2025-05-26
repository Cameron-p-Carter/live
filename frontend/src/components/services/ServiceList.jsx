import React, { useState, useEffect } from 'react';
import serviceApi from '../../services/serviceApi';
import EditService from './EditService';
import './services.css';

const ServiceList = ({ providerId }) => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const [editingService, setEditingService] = useState(null);

    useEffect(() => {
        loadServices();
    }, [providerId]);

    const loadServices = async () => {
        try {
            const servicesData = await serviceApi.getProviderServices(providerId);
            setServices(servicesData);
        } catch (err) {
            setError('Failed to load services');
        }
    };

    const handleToggleStatus = async (serviceId) => {
        try {
            const updatedService = await serviceApi.toggleServiceStatus(serviceId);
            setServices(services.map(service => 
                service.id === serviceId ? updatedService : service
            ));
        } catch (err) {
            setError('Failed to toggle service status');
        }
    };

    const handleDelete = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            await serviceApi.deleteService(serviceId);
            setServices(services.filter(service => service.id !== serviceId));
        } catch (err) {
            setError('Failed to delete service');
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
    };

    const handleServiceUpdated = (updatedService) => {
        setServices(services.map(service => 
            service.id === updatedService.id ? updatedService : service
        ));
        setEditingService(null);
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (editingService) {
        return (
            <EditService 
                service={editingService}
                onServiceUpdated={handleServiceUpdated}
                onCancel={() => setEditingService(null)}
            />
        );
    }

    if (services.length === 0) {
        return <div className="service-list-empty">No services found. Create your first service to get started!</div>;
    }

    return (
        <div className="service-list">
            {services.map(service => (
                <div key={service.id} className="service-card">
                    <h3>{service.title}</h3>
                    <div className="price">${service.price}</div>
                    <div className="category">{service.category.replace('_', ' ')}</div>
                    <div className={`status ${service.active ? 'active' : 'inactive'}`}>
                        {service.active ? 'Active' : 'Inactive'}
                    </div>
                    <div className="service-details">
                        <p><strong>Duration:</strong> {service.estimatedDuration}</p>
                        <p><strong>Area:</strong> {service.serviceArea}</p>
                        {service.description && (
                            <p className="description">{service.description}</p>
                        )}
                    </div>
                    <div className="actions">
                        <button 
                            className="action-button"
                            onClick={() => handleEdit(service)}
                        >
                            Edit
                        </button>
                        <button 
                            className="action-button"
                            onClick={() => handleToggleStatus(service.id)}
                        >
                            {service.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                            className="action-button delete"
                            onClick={() => handleDelete(service.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiceList;
