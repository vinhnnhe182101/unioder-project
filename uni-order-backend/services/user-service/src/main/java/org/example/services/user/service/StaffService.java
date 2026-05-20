package org.example.services.user.service;

import org.example.services.user.dto.request.StaffDTO;

import java.util.List;

public interface StaffService {

    List<StaffDTO> getStaffByRestaurant(Long restaurantId);

    void addStaffToRestaurant(Long restaurantId, String email, String roleName);

    void removeStaffFromRestaurant(Long restaurantId, Long userId, String roleName);
}
