package org.example.catalogservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        Path uploadDir = Paths.get("uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        if (!uploadPath.endsWith(java.io.File.separator)) {
            uploadPath += java.io.File.separator;
        }

        // 2. Map URL vào thư mục vật lý
        // Lưu ý: Gateway chuyển tiếp /api/catalog/uploads/** -> Catalog Service nhận /uploads/** (hoặc nguyên xi tùy config)
        // Để an toàn, ta map cả 2 trường hợp

        // Trường hợp 1: Gateway strip prefix, Catalog nhận /uploads/products/abc.jpg
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath);

        // Trường hợp 2: Gateway giữ nguyên prefix, Catalog nhận /api/catalog/uploads/products/abc.jpg
        registry.addResourceHandler("/api/catalog/uploads/**")
                .addResourceLocations("file:" + uploadPath);
    }
}
