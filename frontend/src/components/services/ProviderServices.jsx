import React, { useState } from 'react';
import CreateService from './CreateService';
import ServiceList from './ServiceList';
import './services.css';

const ProviderServices = ({ providerId }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleServiceCreated = (newService) => {
        setShowCreateForm(false);
        // Trigger a refresh of the service list
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="provider-services">
            <div className="provider-services-header">
                <h2>My Services</h2>
                <button 
                    className="service-button"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Cancel' : 'Create New Service'}
                </button>
            </div>

            {showCreateForm ? (
                <CreateService 
                    providerId={providerId} 
                    onServiceCreated={handleServiceCreated}
                />
            ) : (
                <ServiceList 
                    providerId={providerId}
                    key={refreshTrigger} // Force re-render when a service is created
                />
            )}
        </div>
    );
};

export default ProviderServices;
