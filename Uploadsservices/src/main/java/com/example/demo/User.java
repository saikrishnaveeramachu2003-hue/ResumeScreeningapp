package com.example.demo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean emailVerified = false;

    @Column(name = "otp_code", length = 6)
    private String verificationOtp;

    @Column(name = "login_otp", length = 6)
    private String loginOtp;

    @Column(nullable = false)
    private String role = "ROLE_USER";

    @Column(nullable = true, length = 150)
    private String companyName;

    @Column(nullable = true, length = 100)
    private String hrName;

    @Column(nullable = true, length = 30)
    private String phone;

    @Column(nullable = true, length = 150)
    private String website;
}
