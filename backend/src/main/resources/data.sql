-- Initialize service categories
INSERT INTO service_categories (name) VALUES
('Lawn Mowing'),
('Hedge Trimming'),
('Garden Maintenance'),
('Tree Pruning'),
('Weed Control'),
('Landscaping'),
('Garden Design'),
('Plant Care'),
('Irrigation Systems'),
('Fertilization'),
('Pest Control'),
('Mulching'),
('Leaf Removal'),
('Garden Cleanup'),
('Soil Testing')
ON CONFLICT (name) DO NOTHING;

-- Create test users
INSERT INTO users (id, email, password, first_name, last_name, phone_number, location, user_type) VALUES
(1, 'consumer@example.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z1crSoS1lFqaFS', 'Test', 'Consumer', '0400000000', 'Sydney', 'CONSUMER'),
(2, 'provider@example.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z1crSoS1lFqaFS', 'Test', 'Provider', '0400000001', 'Sydney', 'PROVIDER')
ON CONFLICT (id) DO NOTHING;

-- Create provider profile
INSERT INTO provider_profiles (id, user_id, business_name, service_area, service_description, rating, total_bookings) VALUES
(1, 2, 'Test Garden Services', 'Sydney Metro', 'Professional gardening services specializing in lawn care, garden maintenance, and landscaping. Available 7 days a week.', 4.5, 25)
ON CONFLICT (id) DO NOTHING;

-- Create test service
INSERT INTO services (id, provider_id, title, description, price, estimated_duration, service_area, category, is_active) VALUES
(1, 2, 'Standard Lawn Mowing', 'Professional lawn mowing service including edges and cleanup', 80.00, '2 hours', 'Sydney Metro', 'Lawn Mowing', true)
ON CONFLICT (id) DO NOTHING;

-- Initialize user wallets
INSERT INTO user_wallets (id, user_id, balance) VALUES
(1, 1, 1000.00),  -- Consumer wallet with $1000
(2, 2, 500.00)    -- Provider wallet with $500
ON CONFLICT (id) DO NOTHING;

-- Add initial transactions
INSERT INTO transactions (id, wallet_id, type, amount, description, created_at) VALUES
(1, 1, 'DEPOSIT', 1000.00, 'Initial deposit for testing', CURRENT_TIMESTAMP),
(2, 2, 'DEPOSIT', 500.00, 'Initial deposit for testing', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
