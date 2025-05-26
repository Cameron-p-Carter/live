import { apiClient } from './apiClient.js';
import fetch from 'node-fetch';
globalThis.fetch = fetch;

const SYDNEY_REGIONS = [
    'Sydney',
    'North Sydney',
    'Eastern Suburbs',
    'Inner West',
    'Western Sydney'
];

const SERVICE_CATEGORIES = [
    'LAWN_MOWING',
    'HEDGE_TRIMMING',
    'WEEDING',
    'GENERAL_MAINTENANCE'
];

const REVIEW_COMMENTS = [
    'Great service, very professional!',
    'The garden looks amazing now. Highly recommended.',
    'Punctual and efficient. Will use again.',
    'Very satisfied with the quality of work.',
    'Excellent service, will definitely book again.',
    'Did a fantastic job with my garden.',
    'Very knowledgeable and professional.',
    'Garden has never looked better.',
    'Prompt, professional and great results.',
    'Transformed my garden completely.'
];

async function generateUsers() {
    const users = [];
    
    // Generate 100 consumers
    for (let i = 1; i <= 100; i++) {
        try {
            const userData = {
                email: `consumer${i}@example.com`,
                password: 'OceanPlum29',
                firstName: `Consumer${i}`,
                lastName: `User${i}`,
                phoneNumber: `04${String(i).padStart(8, '0')}`,
                location: SYDNEY_REGIONS[i % SYDNEY_REGIONS.length],
                userType: 'CONSUMER'
            };
            const user = await apiClient.register(userData);
            users.push(user);
            console.log(`Created consumer ${i}`);
        } catch (error) {
            console.error(`Failed to create consumer ${i}:`, error);
        }
    }

    // Generate 100 providers
    for (let i = 1; i <= 100; i++) {
        try {
            const userData = {
                email: `provider${i}@example.com`,
                password: 'OceanPlum29',
                firstName: `Provider${i}`,
                lastName: `User${i}`,
                phoneNumber: `04${String(i + 100).padStart(8, '0')}`,
                location: SYDNEY_REGIONS[i % SYDNEY_REGIONS.length],
                userType: 'PROVIDER',
                businessName: `Garden Pro ${i}`,
                serviceArea: SYDNEY_REGIONS[i % SYDNEY_REGIONS.length],
                serviceDescription: [
                    'Professional gardening services with over 10 years of experience.',
                    'Specializing in lawn care and garden maintenance. Available 7 days.',
                    'Expert landscaping and garden design services. Fully insured.'
                ][i % 3]
            };
            const user = await apiClient.register(userData);
            users.push(user);
            console.log(`Created provider ${i}`);
        } catch (error) {
            console.error(`Failed to create provider ${i}:`, error);
        }
    }

    return users;
}

async function generateServices(users) {
    const services = [];
    const providers = users.filter(u => u.userType === 'PROVIDER');

    for (const provider of providers) {
        // Create 4 services for each provider
        for (let i = 0; i < 4; i++) {
            try {
                const serviceData = {
                    title: `${SERVICE_CATEGORIES[i]} Service`,
                    description: `Professional ${SERVICE_CATEGORIES[i].toLowerCase().replace('_', ' ')} service`,
                    price: 3 + Math.floor(Math.random() * 2), // $3-$5
                    estimatedDuration: `${2 + i} hours`,
                    serviceArea: SYDNEY_REGIONS[i % SYDNEY_REGIONS.length],
                    category: SERVICE_CATEGORIES[i]
                };
                const service = await apiClient.createService(provider.id, serviceData);
                services.push(service);
                console.log(`Created service ${services.length} for provider ${provider.id}`);
            } catch (error) {
                console.error(`Failed to create service for provider ${provider.id}:`, error);
            }
        }
    }

    return services;
}

async function generateBookings(users, services) {
    const bookings = [];
    const consumers = users.filter(u => u.userType === 'CONSUMER');

    // Create 600 bookings (all will be pending by default)
    for (let i = 0; i < 600; i++) {
        try {
            const consumer = consumers[Math.floor(Math.random() * consumers.length)];
            const service = services[Math.floor(Math.random() * services.length)];
            
            // Generate a future date between tomorrow and 30 days from now
            const futureDate = new Date(Date.now() + (Math.random() * 29 + 1) * 24 * 60 * 60 * 1000);
            // Format as ISO string and take just the date and time part (remove milliseconds and timezone)
            const bookingTime = futureDate.toISOString().split('.')[0];
            
            const bookingData = {
                serviceId: service.id,
                bookingTime: bookingTime
            };
            
            const booking = await apiClient.createBooking(consumer.id, bookingData);
            bookings.push(booking);
            console.log(`Created booking ${bookings.length}`);
        } catch (error) {
            console.error(`Failed to create booking ${i}:`, error);
        }
    }

    // Get the last 100 bookings
    const lastHundred = bookings.slice(-100);

    // Confirm them
    console.log('Confirming last 100 bookings...');
    for (const booking of lastHundred) {
        try {
            await apiClient.confirmBooking(booking.id);
            console.log(`Confirmed booking ${booking.id}`);
        } catch (error) {
            console.error(`Failed to confirm booking ${booking.id}:`, error);
        }
    }

    // Complete them
    console.log('Completing last 100 bookings...');
    for (const booking of lastHundred) {
        try {
            await apiClient.completeBooking(booking.id);
            console.log(`Completed booking ${booking.id}`);
        } catch (error) {
            console.error(`Failed to complete booking ${booking.id}:`, error);
        }
    }

    return lastHundred; // Return only the completed bookings for reviews
}

async function generateReviews(users, completedBookings) {
    const reviews = [];

    console.log('Creating reviews for completed bookings...');
    for (const booking of completedBookings) {
        try {
            const reviewData = {
                bookingId: booking.id,
                rating: 3 + Math.floor(Math.random() * 3), // 3-5 stars
                comment: REVIEW_COMMENTS[Math.floor(Math.random() * REVIEW_COMMENTS.length)]
            };
            
            const review = await apiClient.createReview(booking.consumerId, reviewData);
            reviews.push(review);
            console.log(`Created review ${reviews.length}`);
        } catch (error) {
            console.error(`Failed to create review for booking ${booking.id}:`, error);
        }
    }

    return reviews;
}

async function generateWallets(users) {
    for (const user of users) {
        try {
            const amount = 10000; // Everyone gets $10,000
            await apiClient.deposit(user.id, amount);
            console.log(`Added funds to wallet for user ${user.id}`);
        } catch (error) {
            console.error(`Failed to add funds for user ${user.id}:`, error);
        }
    }
}

async function generateAllData() {
    console.log('Starting data generation...');
    
    console.log('Generating users...');
    const users = await generateUsers();
    
    console.log('Generating services...');
    const services = await generateServices(users);
    
    console.log('Generating wallets...');
    await generateWallets(users);
    
    console.log('Generating bookings...');
    const bookings = await generateBookings(users, services);
    
    console.log('Generating reviews...');
    await generateReviews(users, bookings);
    
    console.log('Data generation complete!');
}

generateAllData().catch(console.error);
