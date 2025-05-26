package com.example.live.service;

public enum ServiceCategory {
    LAWN_MOWING("Lawn Mowing"),
    HEDGE_TRIMMING("Hedge Trimming"),
    WEEDING("Weeding"),
    PLANTING("Planting"),
    GENERAL_MAINTENANCE("General Maintenance");

    private final String displayName;

    ServiceCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
