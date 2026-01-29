package com.mwc.wr.shared.config.jwt;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private static Key SECRET;
    @Value("${jwt.expiration}")
    private static Long EXPIRATION_TIME;

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        CustomUserDetails user = (CustomUserDetails) userDetails;
        claims.put("id", user.getId());
        claims.put("email", user.getEmail());
        claims.put("username", user.getUsername());
        claims.put("role", user.getRole().name());
        return doGenerateToken(claims, user.getEmail());
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public static String extractUsername(String token) {
        return Jwts.parser().setSigningKey(SECRET).build().parseClaimsJws(token).getBody().getSubject();
    }

    public String doGenerateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET, SignatureAlgorithm.HS256)
                .compact();
    }

}