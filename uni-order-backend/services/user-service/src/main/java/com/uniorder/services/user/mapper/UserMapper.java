package com.uniorder.services.user.mapper;

import com.uniorder.services.user.dto.UserProfileDTO;
import com.uniorder.services.user.dto.UpdateProfileDTO;
import com.uniorder.services.user.entity.RoleEntity;
import com.uniorder.services.user.entity.UserEntity;
import com.uniorder.services.user.entity.UserRoleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "userRoles", target = "roles", qualifiedByName = "mapRoles")
    UserProfileDTO toUserProfileDTO(UserEntity user);

    void updateEntityFromDto(UpdateProfileDTO updateProfileDTO, @MappingTarget UserEntity userEntity);

    @Named("mapRoles")
    default List<String> mapRoles(Set<UserRoleEntity> userRoles) {
        if (userRoles == null) {
            return List.of();
        }
        return userRoles.stream()
                .map(UserRoleEntity::getRole)
                .map(RoleEntity::getName)
                .collect(Collectors.toList());
    }


}
