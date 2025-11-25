package com.truthmoment.antifakenews.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {

    @Value("${spring.jwt.secret}")
    private String jwtSecret;

    @Value("${spring.jwt.expirationMs}")
    private int jwtExpirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token)
                .getBody().getSubject();
    }

    public Map<String, Object> validateToken(String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                    .parseClaimsJws(token);
            result.put("valid", true);
            result.put("username", claims.getBody().getSubject());
            result.put("expiration", claims.getBody().getExpiration());
        } catch (SignatureException e) {
            result.put("valid", false);
            result.put("error", "Invalid JWT signature");
        } catch (MalformedJwtException e) {
            result.put("valid", false);
            result.put("error", "Invalid JWT token");
        } catch (ExpiredJwtException e) {
            result.put("valid", false);
            result.put("error", "JWT token is expired");
        } catch (UnsupportedJwtException e) {
            result.put("valid", false);
            result.put("error", "JWT token is unsupported");
        } catch (IllegalArgumentException e) {
            result.put("valid", false);
            result.put("error", "JWT claims string is empty");
        }
        return result;
    }
}
