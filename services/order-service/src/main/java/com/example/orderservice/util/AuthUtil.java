package com.example.orderservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class AuthUtil {
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    public Long getUserIdFromToken(String token) {
        try {
            if (token.startsWith("Bearer ")) token = token.substring(7);
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            Key key = Keys.hmacShaKeyFor(keyBytes);
            Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
            return claims.get("userId", Long.class);
        } catch (Exception e) {
            return null;
        }
    }
}
