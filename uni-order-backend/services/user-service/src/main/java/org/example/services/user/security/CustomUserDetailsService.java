package org.example.services.user.security;

import org.example.services.user.entity.UserEntity;
import org.example.services.user.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Cannot find user with email: " + email));

        return new AccountDetails(userEntity);
    }

    public UserDetails loadUserById(Long id) {

        UserEntity userEntity = userRepository.findByIdWithRoles(id)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Cannot find user with id: " + id)
                );
        return new AccountDetails(userEntity);
    }
}
