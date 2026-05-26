package org.example.services.user.controller;

import lombok.RequiredArgsConstructor;
import org.example.services.user.dto.UserProfileDTO;
import org.example.services.user.dto.UpdateProfileDTO;
import org.example.services.user.security.AccountDetails;
import org.example.services.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userServiceImpl;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMyProfile(
            @AuthenticationPrincipal AccountDetails accountDetails
    ) {
        UserProfileDTO userProfileDTO = userServiceImpl.getMyProfile(accountDetails);
        return ResponseEntity.ok(userProfileDTO);
    }

    @PutMapping(value = "/me", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<UserProfileDTO> updateMyProfile(
            @AuthenticationPrincipal AccountDetails currentUser,
            @RequestPart("data") UpdateProfileDTO userProfileDTO,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        Long userId = currentUser.getUserEntity().getUserId();
        UserProfileDTO updateUser = userServiceImpl.updateProfile(userId, userProfileDTO, file);
        return ResponseEntity.ok(updateUser);
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserProfileDTO>> getAllUsers() {
        List<UserProfileDTO> userProfileDTOS = userServiceImpl.getAllUsers();
        return ResponseEntity.ok(userProfileDTOS);
    }

    @PostMapping("/add-restaurant-role")
    public ResponseEntity<String> addRestaurantRole(
            @AuthenticationPrincipal AccountDetails accountDetails,
            @RequestParam Long restId
    ) {
        userServiceImpl.addRestaurantOwnerRole(accountDetails.getUserEntity().getUserId(), restId);
        return ResponseEntity.ok("success");
    }
}
