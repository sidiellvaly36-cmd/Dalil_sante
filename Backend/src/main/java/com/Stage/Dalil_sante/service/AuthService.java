package com.Stage.Dalil_sante.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Stage.Dalil_sante.dto.ChangePasswordRequest;
import com.Stage.Dalil_sante.dto.LoginRequest;
import com.Stage.Dalil_sante.dto.LoginResponse;
import com.Stage.Dalil_sante.dto.RegisterRequest;
import com.Stage.Dalil_sante.dto.UserProfileResponse;
import com.Stage.Dalil_sante.entity.Utilisateur;
import com.Stage.Dalil_sante.enums.Role;
import com.Stage.Dalil_sante.repository.UtilisateurRepository;
import com.Stage.Dalil_sante.security.JwtService;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        Utilisateur utilisateur = utilisateurRepository
                .findByEmailOrTelephone(
                        request.getIdentifiant(),
                        request.getIdentifiant()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Email ou numéro de téléphone incorrect."
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                utilisateur.getPassword()
        )) {
            throw new RuntimeException("Mot de passe incorrect.");
        }

        String token = jwtService.generateToken(utilisateur.getEmail());

        return new LoginResponse(
        token,
        utilisateur.getId(),
        utilisateur.getNom() + " " + utilisateur.getPrenom(),
        utilisateur.getEmail(),
        utilisateur.getTelephone()
        );
    }

    public LoginResponse register(RegisterRequest request) {

    if (utilisateurRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Cet email est déjà utilisé.");
    }

    if (utilisateurRepository.existsByTelephone(request.getTelephone())) {
        throw new RuntimeException("Ce numéro de téléphone est déjà utilisé.");
    }

        Utilisateur utilisateur = new Utilisateur(
            request.getNom(),
            request.getPrenom(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            request.getTelephone(),
            true,
            Role.UTILISATEUR
        );

         utilisateur = utilisateurRepository.save(utilisateur);

         String token = jwtService.generateToken(utilisateur.getEmail());

          return new LoginResponse(
            token,
            utilisateur.getId(),
            utilisateur.getNom() + " " + utilisateur.getPrenom(),
            utilisateur.getEmail(),
            utilisateur.getTelephone()
        );
   }

   public UserProfileResponse getCurrentUser(String email) {

    Utilisateur utilisateur = utilisateurRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Utilisateur introuvable.")
            );

         return new UserProfileResponse(
            utilisateur.getId(),
            utilisateur.getNom(),
            utilisateur.getPrenom(),
            utilisateur.getEmail(),
            utilisateur.getTelephone(),
            utilisateur.getRole().name()
        );
   }

     public void changePassword(
        String email,
        ChangePasswordRequest request
       ) {

    Utilisateur utilisateur = utilisateurRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Utilisateur introuvable.")
            );

    if (!passwordEncoder.matches(
            request.getCurrentPassword(),
            utilisateur.getPassword()
    )) {
        throw new RuntimeException("Le mot de passe actuel est incorrect.");
    }

    if (!request.getNewPassword().equals(request.getConfirmPassword())) {
        throw new RuntimeException("La confirmation du mot de passe ne correspond pas.");
    }

    if (passwordEncoder.matches(
            request.getNewPassword(),
            utilisateur.getPassword()
    )) {
        throw new RuntimeException(
                "Le nouveau mot de passe doit être différent de l'ancien."
        );
    }

    utilisateur.setPassword(
            passwordEncoder.encode(request.getNewPassword())
      );

    utilisateurRepository.save(utilisateur);
   }
}