package com.uniorder.services.user.service;

public interface EmailService {

    void sendVerificationEmail(String email, String token);

    void sendResetPasswordEmail(String email, String token);

}
