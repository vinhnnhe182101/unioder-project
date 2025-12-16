package org.example.services.user.service.impl;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.example.services.user.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    @Override
    public void sendVerificationEmail(String email, String token) {
        try {
            String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + token;
            String subject = "Xác thực tài khoản UniOrder của bạn";

            String content = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9; }
                        .header { background-color: #1890ff; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; color: white; }
                        .content { padding: 30px; background-color: white; text-align: center; }
                        .btn { display: inline-block; padding: 12px 24px; background-color: #1890ff; color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
                        .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Chào mừng đến với UniOrder!</h1>
                        </div>
                        <div class="content">
                            <p>Xin chào,</p>
                            <p>Cảm ơn bạn đã đăng ký tài khoản. Để bắt đầu sử dụng hệ thống quản lý nhà hàng, vui lòng xác thực email của bạn bằng cách nhấn vào nút bên dưới.</p>
                            
                            <a href="%s" class="btn">XÁC THỰC NGAY</a>
                            
                            <p style="margin-top: 30px; font-size: 13px; color: #666;">Liên kết này sẽ hết hạn sau 15 phút.</p>
                        </div>
                        <div class="footer">
                            &copy; 2025 UniOrder System. All rights reserved.
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(verificationUrl);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);
            logger.info("Email xác thực đã gửi đến: {}", email);
        } catch (Exception e) {
            System.err.println("Send email error: " + e.getMessage());
        }
    }

    @Override
    public void sendResetPasswordEmail(String email, String token) {
        try {

            String resetUrl = "http://localhost:5173/reset-password?token=" + token;

            String subject = "Yêu cầu đặt lại mật khẩu UniOrder";
            String content = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9; }
                        .header { background-color: #ff4d4f; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; color: white; }
                        .content { padding: 30px; background-color: white; text-align: center; }
                        .btn { display: inline-block; padding: 12px 24px; background-color: #ff4d4f; color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
                        .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Đặt lại mật khẩu</h1>
                        </div>
                        <div class="content">
                            <p>Xin chào,</p>
                            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email này.</p>
                            <p>Vui lòng nhấn vào nút bên dưới để tạo mật khẩu mới:</p>
                            
                            <div class="button-container">
                                <a href="%s" class="btn">ĐẶT LẠI MẬT KHẨU</a>
                            </div>
                            
                            <p style="margin-top: 30px; font-size: 13px; color: #666;">Liên kết này sẽ hết hạn sau 15 phút.</p>
                        </div>
                        <div class="footer">
                            &copy; 2025 UniOrder System.
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(resetUrl);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(fromEmail, "UniOrder Security");
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(message);
        } catch (Exception e) {
            logger.error("Lỗi khi gửi email reset password: ", e);
        }
    }
}
