package com.Stage.Dalil_sante.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Stage.Dalil_sante.dto.ChangePasswordRequest;
import com.Stage.Dalil_sante.dto.LoginRequest;
import com.Stage.Dalil_sante.dto.LoginResponse;
import com.Stage.Dalil_sante.dto.RegisterRequest;
import com.Stage.Dalil_sante.dto.UserProfileResponse;
import com.Stage.Dalil_sante.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
       public ResponseEntity<LoginResponse> register(
        @Valid @RequestBody RegisterRequest request
    ) {

    LoginResponse response = authService.register(request);

    return ResponseEntity.ok(response);
   }

   @GetMapping("/me")
     public ResponseEntity<UserProfileResponse> getCurrentUser(
        Authentication authentication
    ) {

    UserProfileResponse response = authService.getCurrentUser(
            authentication.getName()
    );

    return ResponseEntity.ok(response);
   }

   @PutMapping("/change-password")
public ResponseEntity<String> changePassword(
        Authentication authentication,
        @Valid @RequestBody ChangePasswordRequest request
    ) {

    authService.changePassword(
            authentication.getName(),
            request
    );

    return ResponseEntity.ok("Mot de passe modifié avec succès.");
  }
}