package com.example.demo.security.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.example.demo.security.services.UserDetailsImpl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

    private static final Logger logger =
            LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    // Generate Secret Key
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );
    }

    // Generate JWT Token
    public String generateJwtToken(Authentication authentication) {

        UserDetailsImpl userPrincipal =
                (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + jwtExpirationMs)
                )
                .signWith(getSigningKey())
                .compact();
    }

    // Extract Username
    public String getUserNameFromJwtToken(String token) {

        Claims claims = parseClaims(token);
        return claims.getSubject();
    }

    // Validate JWT Token
    public boolean validateJwtToken(String authToken) {

        try {
            parseClaims(authToken);
            return true;

        } catch (JwtException e) {
            logger.error("Invalid JWT token", e);

        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty", e);
        }

        return false;
    }

    // Parse JWT Claims (JJWT 0.12.3)
    private Claims parseClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}