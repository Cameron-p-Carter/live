package com.example.live.user.dto;

import com.example.live.user.User;
import com.example.live.user.UserType;
import com.example.live.user.ProviderProfile;

// Facade Pattern: Provides a simplified interface to the complex User and ProviderProfile entities
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String location;
    private String profilePicture;
    private String bio;
    private UserType userType;
    
    // Provider-specific fields
    private String businessName;
    private String serviceArea;
    private String serviceDescription;
    private Double rating;
    private Integer totalBookings;

    // Factory Method Pattern: Creates UserDTO from User entity
    public static UserDTO fromUser(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setLocation(user.getLocation());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setBio(user.getBio());
        dto.setUserType(user.getUserType());
        return dto;
    }

    // Factory Method Pattern: Creates UserDTO from User and ProviderProfile entities
    public static UserDTO fromUserAndProfile(User user, ProviderProfile profile) {
        UserDTO dto = fromUser(user);
        if (profile != null) {
            dto.setBusinessName(profile.getBusinessName());
            dto.setServiceArea(profile.getServiceArea());
            dto.setServiceDescription(profile.getServiceDescription());
            dto.setRating(profile.getRating());
            dto.setTotalBookings(profile.getTotalBookings());
        }
        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public UserType getUserType() { return userType; }
    public void setUserType(UserType userType) { this.userType = userType; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getServiceArea() { return serviceArea; }
    public void setServiceArea(String serviceArea) { this.serviceArea = serviceArea; }

    public String getServiceDescription() { return serviceDescription; }
    public void setServiceDescription(String serviceDescription) { this.serviceDescription = serviceDescription; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Integer totalBookings) { this.totalBookings = totalBookings; }
}
