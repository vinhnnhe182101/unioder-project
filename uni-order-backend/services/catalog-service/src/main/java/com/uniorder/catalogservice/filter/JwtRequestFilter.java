package com.uniorder.catalogservice.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.uniorder.catalogservice.config.RestaurantContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.Key;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getServletPath();

        if (requestPath.contains("/uploads/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String restaurantIdHeader = request.getHeader("x-restaurant-id");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(getSigningKey())
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                Long restaurantId = null;

                if (restaurantIdHeader != null && !restaurantIdHeader.isEmpty()) {
                    try {
                        Long headerRestId = Long.valueOf(restaurantIdHeader);

                        if (headerRestId != null && headerRestId > 0) {
                            restaurantId = headerRestId;
                        }
                    } catch (NumberFormatException e) {
                        logger.warn("Invalid Restaurant ID format in Header: " + restaurantIdHeader);
                    }
                }
                if (restaurantId == null) {
                    Object restIdClaim = claims.get("restaurantId");
                    if (restIdClaim != null) {
                        try {
                            restaurantId = Long.valueOf(restIdClaim.toString());
                        } catch (NumberFormatException e) {
                            logger.warn("Invalid restaurantId in JWT claims: " + restIdClaim);
                        }
                    }
                }
                if (restaurantId != null) {
                    RestaurantContext.setRestaurantId(restaurantId);
                }
            } catch (Exception e) {
                System.err.println("Invalid Token: " + e.getMessage());
            }
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            RestaurantContext.clear();
        }
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
