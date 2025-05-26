package com.example.live.service;

import com.example.live.service.dto.CreateServiceRequest;
import com.example.live.service.dto.ServiceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {

    private final ServiceService serviceService;

    @Autowired
    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    // Provider endpoints
    @PostMapping("/provider/{providerId}")
    public ResponseEntity<ServiceResponse> createService(
            @PathVariable Long providerId,
            @RequestBody CreateServiceRequest request) {
        ServiceResponse service = serviceService.createService(providerId, request);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ServiceResponse>> getProviderServices(@PathVariable Long providerId) {
        List<ServiceResponse> services = serviceService.getProviderServices(providerId);
        return ResponseEntity.ok(services);
    }

    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable Long serviceId,
            @RequestBody CreateServiceRequest request) {
        ServiceResponse service = serviceService.updateService(serviceId, request);
        return ResponseEntity.ok(service);
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<String> deleteService(@PathVariable Long serviceId) {
        serviceService.deleteService(serviceId);
        return ResponseEntity.ok("Service deleted successfully");
    }

    @PatchMapping("/{serviceId}/toggle")
    public ResponseEntity<ServiceResponse> toggleServiceStatus(@PathVariable Long serviceId) {
        ServiceResponse service = serviceService.toggleServiceStatus(serviceId);
        return ResponseEntity.ok(service);
    }

    // Consumer endpoints
    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAllActiveServices() {
        List<ServiceResponse> services = serviceService.getAllActiveServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<ServiceResponse> getServiceById(@PathVariable Long serviceId) {
        ServiceResponse service = serviceService.getServiceById(serviceId);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ServiceResponse>> searchByCategory(
            @PathVariable ServiceCategory category) {
        List<ServiceResponse> services = serviceService.searchServicesByCategory(category);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ServiceResponse>> searchByLocation(
            @RequestParam String location) {
        List<ServiceResponse> services = serviceService.searchServicesByLocation(location);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/categories")
    public ResponseEntity<ServiceCategory[]> getAllCategories() {
        return ResponseEntity.ok(ServiceCategory.values());
    }
}
