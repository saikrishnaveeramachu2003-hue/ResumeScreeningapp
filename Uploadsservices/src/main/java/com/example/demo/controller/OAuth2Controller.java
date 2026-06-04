package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.User;
import com.example.demo.UserRepository;
import com.example.demo.security.jwt.JwtUtils;
import com.example.demo.security.services.UserDetailsImpl;

@RestController
@RequestMapping("/api/oauth2")
public class OAuth2Controller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Handle OAuth2 login callback
     * This endpoint is called after successful OAuth2 authentication
     */
    @GetMapping("/login/success")
    public ResponseEntity<?> oAuth2LoginSuccess(OAuth2AuthenticationToken authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Unauthorized");
            errorResponse.put("message", "OAuth2 authentication failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        OAuth2User oAuth2User = authentication.getPrincipal();
        String email = (String) oAuth2User.getAttribute("email");
        String name = (String) oAuth2User.getAttribute("name");
        String provider = authentication.getAuthorizedClientRegistrationId();

        // Find or create user
        Optional<User> existingUser = userRepository.findByUsernameOrEmail(
                name != null ? name : email.split("@")[0], email);
        User user = existingUser.orElse(null);
        
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUsername(name != null ? name : email.split("@")[0]);
            user.setPassword("OAUTH2_LOGIN_" + provider.toUpperCase());
            user.setEmailVerified(true);
            user.setRole("ROLE_USER");
            userRepository.save(user);
        }

        // Generate JWT token using Authentication object
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        String jwtToken = jwtUtils.generateJwtToken(authToken);

        // Return JWT token and user info
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("type", "Bearer");
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("username", user.getUsername());
        response.put("provider", provider);

        return ResponseEntity.ok(response);
    }

    /**
     * Get current OAuth2 authenticated user info
     */
    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(OAuth2AuthenticationToken authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Unauthorized");
            errorResponse.put("message", "Not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        OAuth2User oAuth2User = authentication.getPrincipal();
        String email = (String) oAuth2User.getAttribute("email");
        String provider = authentication.getAuthorizedClientRegistrationId();

        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("name", oAuth2User.getAttribute("name"));
        response.put("provider", provider);
        response.put("attributes", oAuth2User.getAttributes());

        return ResponseEntity.ok(response);
    }
}
