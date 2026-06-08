package com.uniorder.services.user.service.impl;

import com.uniorder.services.user.dto.UserProfileDTO;
import com.uniorder.common.util.FileStorageUtil;
import com.uniorder.services.user.dto.UpdateProfileDTO;
import com.uniorder.services.user.entity.RoleEntity;
import com.uniorder.services.user.entity.UserEntity;
import com.uniorder.services.user.entity.UserRoleEntity;
import com.uniorder.services.user.mapper.UserMapper;
import com.uniorder.services.user.repository.RoleRepository;
import com.uniorder.services.user.repository.UserRepository;
import com.uniorder.services.user.repository.UserRoleRepository;
import com.uniorder.services.user.security.AccountDetails;
import com.uniorder.services.user.service.UserService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    private UserRepository userRepository;
    private UserRoleRepository userRoleRepository;
    private RoleRepository roleRepository;
    private FileStorageUtil fileStorageUtil;

    public UserServiceImpl(UserMapper userMapper,
                           UserRepository userRepository,
                           UserRoleRepository userRoleRepository,
                           RoleRepository roleRepository,
                           FileStorageUtil fileStorageUtil) {
        this.userMapper = userMapper;
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.roleRepository = roleRepository;
        this.fileStorageUtil = fileStorageUtil;
    }

    @Override
    public UserProfileDTO getMyProfile(AccountDetails accountDetails) {

        UserEntity currentUser = accountDetails.getUserEntity();

        return userMapper.toUserProfileDTO(currentUser);
    }

    @Transactional
    @Override
    public UserProfileDTO updateProfile(Long userId, UpdateProfileDTO updateProfileDTO, MultipartFile file) {

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        userMapper.updateEntityFromDto(updateProfileDTO, userEntity);

        if (file != null && !file.isEmpty()) {
            fileStorageUtil.deleteFile(userEntity.getAvatarUrl());
            String avatarUrl = fileStorageUtil.storeImage(file, "avatars");
            userEntity.setAvatarUrl(avatarUrl);
        } else if (updateProfileDTO.getAvatarUrl() != null) {
            // Giữ logic cũ nếu muốn update bằng link
            userEntity.setAvatarUrl(updateProfileDTO.getAvatarUrl());
        }

        UserEntity userEntityUpdated = userRepository.save(userEntity);

        return userMapper.toUserProfileDTO(userEntityUpdated);
    }

    @Transactional(readOnly = true)
    public List<UserProfileDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserProfileDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public UserProfileDTO getUserProfile(Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return userMapper.toUserProfileDTO(userEntity);
    }

    @Transactional
    @Override
    public void addRestaurantOwnerRole(Long userId, Long restaurantId){
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        RoleEntity ownerRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        boolean alreadyExists = userEntity.getUserRoles().stream()
                .anyMatch(ur -> ur.getId().getRestaurantId().equals(restaurantId) &&
                        ur.getRole().getRoleId().equals(ownerRole.getRoleId()));

        if (!alreadyExists) {
            UserRoleEntity newRole = new UserRoleEntity(userEntity, ownerRole, restaurantId);
            userRoleRepository.save(newRole);
        }
    }
}
