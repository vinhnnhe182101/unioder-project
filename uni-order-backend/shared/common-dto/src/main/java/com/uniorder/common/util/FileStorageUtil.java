package com.uniorder.common.util;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

public class FileStorageUtil {

    private static final String UPLOAD_DIR = "uploads";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final int TARGET_WIDTH = 800;

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    /**
     * Lưu file ảnh và resize nếu cần
     */
    public String storeImage(MultipartFile file, String subFolder) {
        validateFile(file);

        Path uploadPath = createUploadDirectory(subFolder);
        String fileName = generateFileName(file);

        Path targetLocation = uploadPath.resolve(fileName).normalize();
        validatePathSecurity(uploadPath, targetLocation);

        try {
            resizeAndSaveImage(file, targetLocation);
            return "/" + UPLOAD_DIR + "/" + subFolder + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu file ảnh", e);
        }
    }

    /**
     * Xóa file theo URL đã lưu
     */
    public void deleteFile(String fileUrl) {
        if (!StringUtils.hasText(fileUrl)) return;

        try {
            String relativePath = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
            Path filePath = Paths.get(relativePath).toAbsolutePath().normalize();
            Path uploadRoot = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();

            if (!filePath.startsWith(uploadRoot)) {
                throw new SecurityException("Đường dẫn xóa file không hợp lệ");
            }

            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Không thể xóa file: " + fileUrl, e);
        }
    }

    /* ======================= PRIVATE METHODS ======================= */

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được rỗng");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Dung lượng file vượt quá 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Định dạng file không được hỗ trợ");
        }
    }

    private Path createUploadDirectory(String subFolder) {
        try {
            Path path = Paths.get(UPLOAD_DIR, subFolder)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(path);
            return path;
        } catch (IOException e) {
            throw new RuntimeException("Không thể tạo thư mục upload", e);
        }
    }

    private String generateFileName(MultipartFile file) {
        String extension = getFileExtension(file.getContentType());
        return UUID.randomUUID() + "." + extension;
    }

    private String getFileExtension(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> "jpg";
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            default -> throw new IllegalArgumentException("Unsupported content type");
        };
    }

    private void validatePathSecurity(Path uploadDir, Path targetPath) {
        if (!targetPath.startsWith(uploadDir)) {
            throw new SecurityException("Path traversal detected");
        }
    }

    private void resizeAndSaveImage(MultipartFile file, Path targetLocation) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            BufferedImage originalImage = ImageIO.read(inputStream);

            if (originalImage == null) {
                throw new IllegalArgumentException("File không phải ảnh hợp lệ");
            }

            int width = originalImage.getWidth();
            if (width <= TARGET_WIDTH) {
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                return;
            }

            int height = originalImage.getHeight();
            int targetHeight = (int) ((double) TARGET_WIDTH / width * height);

            boolean hasAlpha = originalImage.getColorModel().hasAlpha();
            int imageType = hasAlpha ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB;

            BufferedImage resizedImage = new BufferedImage(TARGET_WIDTH, targetHeight, imageType);
            Graphics2D g = resizedImage.createGraphics();

            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
                    RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g.setRenderingHint(RenderingHints.KEY_RENDERING,
                    RenderingHints.VALUE_RENDER_QUALITY);
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                    RenderingHints.VALUE_ANTIALIAS_ON);

            g.drawImage(originalImage, 0, 0, TARGET_WIDTH, targetHeight, null);
            g.dispose();

            ImageIO.write(resizedImage, getFileExtension(file.getContentType()), targetLocation.toFile());
        }
    }
}
