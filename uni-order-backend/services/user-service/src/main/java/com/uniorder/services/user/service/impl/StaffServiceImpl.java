package com.uniorder.services.user.service.impl;

import com.uniorder.services.user.dto.request.StaffDTO;
import com.uniorder.services.user.entity.RoleEntity;
import com.uniorder.services.user.entity.UserEntity;
import com.uniorder.services.user.entity.UserRoleEntity;
import com.uniorder.services.user.repository.RoleRepository;
import com.uniorder.services.user.repository.UserRepository;
import com.uniorder.services.user.repository.UserRoleRepository;
import com.uniorder.services.user.service.StaffService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffServiceImpl implements StaffService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private UserRoleRepository userRoleRepository;

    public StaffServiceImpl(UserRepository userRepository, RoleRepository roleRepository, UserRoleRepository userRoleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
    }

    @Transactional
    @Override
    public List<StaffDTO> getStaffByRestaurant(Long restaurantId) {
        return userRoleRepository.findAllByRestaurantId(restaurantId)
                .stream()
                .map(ur -> StaffDTO.builder()
                        .userId(ur.getUser().getUserId())
                        .email(ur.getUser().getEmail())
                        .fullName(ur.getUser().getFullName())
                        .avatarUrl(ur.getUser().getAvatarUrl())
                        .roleName(ur.getRole().getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void addStaffToRestaurant(Long restaurantId, String email, String roleName) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        RoleEntity role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Invalid role"));

        boolean exists = userRoleRepository
                .existsById_RestaurantIdAndId_UserIdAndId_RoleId(
                        restaurantId,
                        user.getUserId(),
                        role.getRoleId()
                );

        if (!exists) {
            UserRoleEntity ur = new UserRoleEntity(user, role, restaurantId);
            user.addUserRole(ur);
        }
    }

    @Transactional
    @Override
    public void removeStaffFromRestaurant(Long restaurantId, Long userId, String roleName) {
        RoleEntity role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Invalid role"));

        userRoleRepository.deleteById_RestaurantIdAndId_UserIdAndId_RoleId(
                restaurantId,
                userId,
                role.getRoleId()
        );
    }
}
