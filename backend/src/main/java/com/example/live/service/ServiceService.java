package com.example.live.service;

import com.example.live.service.dto.CreateServiceRequest;
import com.example.live.service.dto.ServiceResponse;
import com.example.live.user.User;
import com.example.live.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

// Singleton Pattern: Spring's @Service annotation ensures only one instance is created
@Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    @Autowired
    public ServiceService(ServiceRepository serviceRepository, UserRepository userRepository) {
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ServiceResponse createService(Long providerId, CreateServiceRequest request) {
        // Validate request
        request.validate();

        // Get provider
        User provider = userRepository.findById(providerId)
            .orElseThrow(() -> new RuntimeException("Provider not found"));

        // Create service
        com.example.live.service.Service service = new com.example.live.service.Service();
        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setEstimatedDuration(request.getEstimatedDuration());
        service.setServiceArea(request.getServiceArea());
        service.setCategory(request.getCategory());
        service.setProvider(provider);
        service.setActive(true);

        service = serviceRepository.save(service);
        return ServiceResponse.fromService(service);
    }

    public List<ServiceResponse> getProviderServices(Long providerId) {
        User provider = userRepository.findById(providerId)
            .orElseThrow(() -> new RuntimeException("Provider not found"));

        return serviceRepository.findByProvider(provider).stream()
            .map(ServiceResponse::fromService)
            .collect(Collectors.toList());
    }

    public List<ServiceResponse> getAllActiveServices() {
        return serviceRepository.findByIsActiveTrue().stream()
            .map(ServiceResponse::fromService)
            .collect(Collectors.toList());
    }

    public ServiceResponse getServiceById(Long id) {
        com.example.live.service.Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));
        return ServiceResponse.fromService(service);
    }

    @Transactional
    public ServiceResponse updateService(Long serviceId, CreateServiceRequest request) {
        // Validate request
        request.validate();

        // Get service
        com.example.live.service.Service service = serviceRepository.findById(serviceId)
            .orElseThrow(() -> new RuntimeException("Service not found"));

        // Update fields
        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setEstimatedDuration(request.getEstimatedDuration());
        service.setServiceArea(request.getServiceArea());
        service.setCategory(request.getCategory());

        service = serviceRepository.save(service);
        return ServiceResponse.fromService(service);
    }

    @Transactional
    public ServiceResponse toggleServiceStatus(Long serviceId) {
        com.example.live.service.Service service = serviceRepository.findById(serviceId)
            .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setActive(!service.isActive());
        service = serviceRepository.save(service);
        return ServiceResponse.fromService(service);
    }

    @Transactional
    public void deleteService(Long serviceId) {
        if (!serviceRepository.existsById(serviceId)) {
            throw new RuntimeException("Service not found");
        }
        serviceRepository.deleteById(serviceId);
    }

    public List<ServiceResponse> searchServicesByCategory(ServiceCategory category) {
        return serviceRepository.findByCategoryAndIsActiveTrue(category).stream()
            .map(ServiceResponse::fromService)
            .collect(Collectors.toList());
    }

    public List<ServiceResponse> searchServicesByLocation(String location) {
        return serviceRepository.findByServiceAreaContainingIgnoreCaseAndIsActiveTrue(location).stream()
            .map(ServiceResponse::fromService)
            .collect(Collectors.toList());
    }
}
