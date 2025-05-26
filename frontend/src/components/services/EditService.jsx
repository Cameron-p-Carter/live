import React, { useState, useEffect } from 'react';
import serviceApi from '../../services/serviceApi';
import './services.css';

const EditService = ({ service, onServiceUpdated, onCancel }) => {
    const [formData, setFormData] = useState({
        title: service.title,
        description: service.description || '',
        price: service.price,
        estimatedDuration: service.estimatedDuration,
        serviceArea: service.serviceArea,
        category: service.category
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const categoriesData = await serviceApi.getCategories();
            setCategories(categoriesData);
        } catch (err) {
            setError('Failed to load categories');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convert price to number if it's the price field
        const finalValue = name === 'price' ? 
            (value === '' ? '' : parseFloat(value)) : value;

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await serviceApi.updateService(service.id, formData);
            onServiceUpdated(response);
        } catch (err) {
            setError('Failed to update service. Please check all required fields.');
        }
    };

    return (
        <div className="service-form-container">
            <h2>Edit Service</h2>
            <form onSubmit={handleSubmit} className="service-form">
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Weekly Lawn Mowing Service"
                    />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your service..."
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                    />
                </div>

                <div className="form-group">
                    <label>Estimated Duration:</label>
                    <input
                        type="text"
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 2 hours"
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
                        placeholder="e.g., North Sydney"
                    />
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <div className="error-message">{error}</div>}
                
                <div className="button-group">
                    <button type="button" className="cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="save-button">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditService;
