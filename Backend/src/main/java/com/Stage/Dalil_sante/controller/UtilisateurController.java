package com.Stage.Dalil_sante.controller;

import com.Stage.Dalil_sante.dto.UtilisateurCreateRequest;
import com.Stage.Dalil_sante.dto.UtilisateurResponse;
import com.Stage.Dalil_sante.dto.UtilisateurUpdateRequest;
import com.Stage.Dalil_sante.entity.Utilisateur;
import com.Stage.Dalil_sante.service.UtilisateurService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@PreAuthorize("hasRole('ADMIN')")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(
            UtilisateurService utilisateurService
    ) {
        this.utilisateurService = utilisateurService;
    }

    // Créer un utilisateur
    @PostMapping
    public ResponseEntity<UtilisateurResponse> createUtilisateur(
            @Valid @RequestBody UtilisateurCreateRequest request
    ) {

        Utilisateur utilisateur = new Utilisateur(
                request.getNom(),
                request.getPrenom(),
                request.getEmail(),
                request.getPassword(),
                request.getTelephone(),
                true,
                request.getRole()
        );

        Utilisateur created =
                utilisateurService.createUtilisateur(
                        utilisateur
                );

        return ResponseEntity.ok(toResponse(created));
    }

    // Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<UtilisateurResponse>>
    getAllUtilisateurs() {

        List<UtilisateurResponse> utilisateurs =
                utilisateurService.getAllUtilisateurs()
                        .stream()
                        .map(UtilisateurController::toResponse)
                        .toList();

        return ResponseEntity.ok(utilisateurs);
    }

    // Récupérer les utilisateurs actifs
    @GetMapping("/active")
    public ResponseEntity<List<UtilisateurResponse>>
    getActiveUtilisateurs() {

        List<UtilisateurResponse> utilisateurs =
                utilisateurService.getActiveUtilisateurs()
                        .stream()
                        .map(UtilisateurController::toResponse)
                        .toList();

        return ResponseEntity.ok(utilisateurs);
    }

    // Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<UtilisateurResponse>
    getUtilisateurById(
            @PathVariable Long id
    ) {

        return utilisateurService
                .getUtilisateurById(id)
                .map(UtilisateurController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Rechercher un utilisateur par nom
    @GetMapping("/search")
    public ResponseEntity<List<UtilisateurResponse>>
    searchByNom(
            @RequestParam String nom
    ) {

        List<UtilisateurResponse> utilisateurs =
                utilisateurService.searchByNom(nom)
                        .stream()
                        .map(UtilisateurController::toResponse)
                        .toList();

        return ResponseEntity.ok(utilisateurs);
    }

    // Modifier un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<UtilisateurResponse>
    updateUtilisateur(
            @PathVariable Long id,
            @RequestBody UtilisateurUpdateRequest request
    ) {

        Utilisateur utilisateur = new Utilisateur(
                request.getNom(),
                request.getPrenom(),
                request.getEmail(),
                null,
                request.getTelephone(),
                request.getActif(),
                null
        );

        Utilisateur updated =
                utilisateurService.updateUtilisateur(
                        id,
                        utilisateur
                );

        return ResponseEntity.ok(toResponse(updated));
    }

    // Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteUtilisateur(
            @PathVariable Long id
    ) {

        utilisateurService.deleteUtilisateur(id);

        return ResponseEntity.noContent().build();
    }

    private static UtilisateurResponse toResponse(
            Utilisateur utilisateur
    ) {

        String role = utilisateur.getRole() != null
                ? utilisateur.getRole().name()
                : null;

        return new UtilisateurResponse(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getTelephone(),
                utilisateur.getActif(),
                role,
                utilisateur.getDateCreation()
        );
    }
}