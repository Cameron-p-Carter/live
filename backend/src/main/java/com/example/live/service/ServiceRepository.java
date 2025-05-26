package com.example.live.service;

import com.example.live.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    // Find all services by provider
    List<Service> findByProvider(User provider);
    
    // Find all active services
    List<Service> findByIsActiveTrue();
    
    // Find all active services by provider
    List<Service> findByProviderAndIsActiveTrue(User provider);
    
    // Find services by category and active status
    List<Service> findByCategoryAndIsActiveTrue(ServiceCategory category);
    
    // Find services by location (service area) and active status
    List<Service> findByServiceAreaContainingIgnoreCaseAndIsActiveTrue(String location);
}
