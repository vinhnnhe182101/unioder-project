package org.example.common.config;

import org.example.common.util.FileStorageUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CommonBeanConfig {

    @Bean
    public FileStorageUtil fileStorageUtil() {
        return new FileStorageUtil();
    }
}
