package com.example.live.user.dto;

import com.example.live.user.UserType;

public class UserRegistrationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String location;
    private String profilePicture;
    private String bio;
    private UserType userType;
    private String businessName;      // Provider only
    private String serviceArea;       // Provider only
    private String serviceDescription; // Provider only

    // Default constructor required for JSON deserialization
    public UserRegistrationRequest() {}

    // Getters and Setters with validation
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        if (firstName == null || firstName.trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        if (lastName == null || lastName.trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Valid email is required");
        }
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required");
        }
        this.phoneNumber = phoneNumber;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        if (location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("Location is required");
        }
        this.location = location;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        if (userType == null) {
            throw new IllegalArgumentException("User type is required");
        }
        this.userType = userType;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        if (userType == UserType.PROVIDER && (serviceArea == null || serviceArea.trim().isEmpty())) {
            throw new IllegalArgumentException("Service area is required for providers");
        }
        this.serviceArea = serviceArea;
    }

    public String getServiceDescription() {
        return serviceDescription;
    }

    public void setServiceDescription(String serviceDescription) {
        this.serviceDescription = serviceDescription;
    }

    // Validation method to ensure all required fields are present
    public void validate() {
        if (firstName == null || lastName == null || email == null || 
            password == null || phoneNumber == null || location == null || userType == null) {
            throw new IllegalStateException("Required fields must not be null");
        }

        if (userType == UserType.PROVIDER && serviceArea == null) {
            throw new IllegalStateException("Service area is required for providers");
        }
    }
}
