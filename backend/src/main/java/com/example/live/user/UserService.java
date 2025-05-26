package com.example.live.user;

import com.example.live.user.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

// Singleton Pattern: Spring's @Service annotation ensures only one instance is created
@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;

    @Autowired
    public UserService(UserRepository userRepository, ProviderProfileRepository providerProfileRepository) {
        this.userRepository = userRepository;
        this.providerProfileRepository = providerProfileRepository;
    }

    public LoginResponse login(LoginRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

            // In a real application, we would hash the password and compare hashes
            if (!user.getPassword().equals(request.getPassword())) {
                return LoginResponse.failure("Invalid email or password");
            }

            return LoginResponse.success(user.getId());
        } catch (Exception e) {
            return LoginResponse.failure("Invalid email or password");
        }
    }

    @Transactional
    public LoginResponse changePassword(Long userId, PasswordChangeRequest request) {
        try {
            // Validate passwords match
            request.validate();

            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify current password
            if (!user.getPassword().equals(request.getCurrentPassword())) {
                return LoginResponse.failure("Current password is incorrect");
            }

            // Update password
            user.setPassword(request.getNewPassword());
            userRepository.save(user);

            return LoginResponse.success(user.getId());
        } catch (IllegalArgumentException e) {
            return LoginResponse.failure(e.getMessage());
        } catch (Exception e) {
            return LoginResponse.failure("Failed to change password");
        }
    }

    @Transactional
    public UserDTO registerUser(UserRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In real app, would hash password
        user.setPhoneNumber(request.getPhoneNumber());
        user.setLocation(request.getLocation());
        user.setProfilePicture(request.getProfilePicture());
        user.setBio(request.getBio());
        user.setUserType(request.getUserType());

        user = userRepository.save(user);

        // If provider, create provider profile
        if (request.getUserType() == UserType.PROVIDER) {
            ProviderProfile profile = new ProviderProfile();
            profile.setUser(user);
            profile.setBusinessName(request.getBusinessName());
            profile.setServiceArea(request.getServiceArea());
            profile.setServiceDescription(request.getServiceDescription());
            profile.setRating(0.0);
            profile.setTotalBookings(0);
            
            profile = providerProfileRepository.save(profile);
            return UserDTO.fromUserAndProfile(user, profile);
        }

        return UserDTO.fromUser(user);
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getUserType() == UserType.PROVIDER) {
            ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));
            return UserDTO.fromUserAndProfile(user, profile);
        }

        return UserDTO.fromUser(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(user -> {
                if (user.getUserType() == UserType.PROVIDER) {
                    ProviderProfile profile = providerProfileRepository.findByUser(user)
                        .orElse(null);
                    return UserDTO.fromUserAndProfile(user, profile);
                }
                return UserDTO.fromUser(user);
            })
            .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO updateUser(Long id, UserRegistrationRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setLocation(request.getLocation());
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        user = userRepository.save(user);

        if (user.getUserType() == UserType.PROVIDER) {
            ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));
            
            if (request.getBusinessName() != null) {
                profile.setBusinessName(request.getBusinessName());
            }
            if (request.getServiceArea() != null) {
                profile.setServiceArea(request.getServiceArea());
            }
            if (request.getServiceDescription() != null) {
                profile.setServiceDescription(request.getServiceDescription());
            }
            
            profile = providerProfileRepository.save(profile);
            return UserDTO.fromUserAndProfile(user, profile);
        }

        return UserDTO.fromUser(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // If it's a provider, delete their profile first
        if (user.getUserType() == UserType.PROVIDER) {
            providerProfileRepository.findByUser(user)
                .ifPresent(profile -> providerProfileRepository.delete(profile));
        }

        // Then delete the user
        userRepository.delete(user);
    }
}
