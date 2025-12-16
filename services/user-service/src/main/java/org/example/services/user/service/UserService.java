package org.example.services.user.service;

import org.example.auth.UserProfileDTO;
import org.example.services.user.dto.UpdateProfileDTO;
import org.example.services.user.security.AccountDetails;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    UserProfileDTO getMyProfile(AccountDetails accountDetails);

    UserProfileDTO updateProfile(Long userId, UpdateProfileDTO updateProfileDTO, MultipartFile file);

    List<UserProfileDTO> getAllUsers();

    UserProfileDTO getUserProfile(Long userId);

    void addRestaurantOwnerRole(Long userId, Long restaurantId);


}
