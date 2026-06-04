package com.example.demo.controller;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.EmailService;
import com.example.demo.User;
import com.example.demo.UserRepository;
import com.example.demo.security.jwt.JwtUtils;
import com.example.demo.security.services.UserDetailsImpl;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("http://localhost:5173")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailService emailService;

    private static final SecureRandom OTP_RANDOM = new SecureRandom();

    private static String generateOtp() {
        return String.format("%06d", OTP_RANDOM.nextInt(1_000_000));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> existingUser = userRepository.findByUsernameOrEmail(loginRequest.getUsername(), loginRequest.getUsername());
        if (existingUser.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }

        User user = existingUser.get();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body(new MessageResponse("Invalid username or password."));
        }

        String otp = generateOtp();
        user.setLoginOtp(otp);
        userRepository.save(user);
        emailService.sendOtpEmail(user.getEmail(), otp);

        return ResponseEntity.ok(new MessageResponse("OTP sent to your registered email. Verify it with /api/auth/verify-login-otp to complete login."));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User();

user.setUsername(signUpRequest.getUsername());

user.setEmail(signUpRequest.getEmail());

user.setPassword(
    encoder.encode(signUpRequest.getPassword())
);

user.setRole("ROLE_HR");

user.setEmailVerified(true);

user.setCompanyName(
    signUpRequest.getCompanyName()
);

user.setHrName(
    signUpRequest.getHrName()
);

user.setPhone(
    signUpRequest.getPhone()
);

user.setWebsite(
    signUpRequest.getWebsite()
);



user.setLoginOtp(null);

userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully! You can now sign in."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        Optional<User> optionalUser = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }

        User user = optionalUser.get();
        if (user.isEmailVerified()) {
            return ResponseEntity.ok(new MessageResponse("Email already verified."));
        }

        if (user.getVerificationOtp() == null || !user.getVerificationOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid OTP code."));
        }

        user.setEmailVerified(true);
        user.setVerificationOtp(null);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("OTP verified successfully. You can now sign in."));
    }

    @PostMapping("/verify-login-otp")
    public ResponseEntity<?> verifyLoginOtp(@RequestBody VerifyLoginOtpRequest request) {
        Optional<User> optionalUser = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }

        User user = optionalUser.get();
        if (user.getLoginOtp() == null || !user.getLoginOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid OTP code."));
        }

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        user.setLoginOtp(null);
        userRepository.save(user);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody ResendOtpRequest request) {
        Optional<User> optionalUser = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }

        User user = optionalUser.get();
        String otp = generateOtp();
        user.setLoginOtp(otp);
        userRepository.save(user);
        emailService.sendOtpEmail(user.getEmail(), otp);

        return ResponseEntity.ok(new MessageResponse("OTP resent successfully. Check your email."));
    }

    @PostMapping(path = "/signup/company", consumes = "application/json")
    public ResponseEntity<?> registerCompany(@RequestBody CompanySignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User();
        // use email as username for simplicity
        user.setUsername(req.getEmail());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setRole("ROLE_USER");
        user.setEmailVerified(true);

        user.setCompanyName(req.getCompanyName());
        user.setHrName(req.getHrName());
        user.setPhone(req.getPhone());
        user.setWebsite(req.getWebsite());

        userRepository.save(user);

        return ResponseEntity.status(201).body(new MessageResponse("Company account created successfully. You can now sign in."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null
                || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.ok(new MessageResponse("No authenticated user"));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(new UserInfoResponse(userDetails.getId(), userDetails.getUsername(), userDetails.getEmail()));
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }

  @Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public static class SignupRequest {

    private String username;

    private String email;

    private String password;

    private String companyName;

    private String hrName;

    private String phone;

    private String website;
}

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyOtpRequest {
        private String usernameOrEmail;
        private String otp;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyLoginOtpRequest {
        private String usernameOrEmail;
        private String otp;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResendOtpRequest {
        private String usernameOrEmail;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanySignupRequest {
        private String companyName;
        private String hrName;
        private String email;
        private String phone;
        private String website;
        private String password;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JwtResponse {
        private String token;
        private Long id;
        private String username;
        private String email;
        private List<String> roles;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageResponse {
        private String message;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfoResponse {
        private Long id;
        private String username;
        private String email;
    }
}
