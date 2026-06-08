package com.uniorder.common.config;

import com.uniorder.common.util.FileStorageUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CommonBeanConfig {

    @Bean
    public FileStorageUtil fileStorageUtil() {
        return new FileStorageUtil();
    }
}
