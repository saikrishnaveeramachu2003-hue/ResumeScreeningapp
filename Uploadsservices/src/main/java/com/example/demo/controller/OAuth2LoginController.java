package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class OAuth2LoginController {

    @GetMapping("/google")
    public String redirectToGoogleLogin() {
        return "redirect:/oauth2/authorize/google";
    }
}
