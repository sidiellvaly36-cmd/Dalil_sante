package com.Stage.Dalil_sante.controller;

import com.Stage.Dalil_sante.entity.Utilisateur;
import com.Stage.Dalil_sante.service.UtilisateurService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(
            UtilisateurService utilisateurService
    ) {
        this.utilisateurService = utilisateurService;
    }

    // Créer un utilisateur
    @PostMapping
    public ResponseEntity<Utilisateur> createUtilisateur(
            @RequestBody Utilisateur utilisateur
    ) {

        return ResponseEntity.ok(
                utilisateurService.createUtilisateur(
                        utilisateur
                )
        );
    }

    // Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<Utilisateur>>
    getAllUtilisateurs() {

        return ResponseEntity.ok(
                utilisateurService.getAllUtilisateurs()
        );
    }

    // Récupérer les utilisateurs actifs
    @GetMapping("/active")
    public ResponseEntity<List<Utilisateur>>
    getActiveUtilisateurs() {

        return ResponseEntity.ok(
                utilisateurService.getActiveUtilisateurs()
        );
    }

    // Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur>
    getUtilisateurById(
            @PathVariable Long id
    ) {

        return utilisateurService
                .getUtilisateurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Rechercher un utilisateur par nom
    @GetMapping("/search")
    public ResponseEntity<List<Utilisateur>>
    searchByNom(
            @RequestParam String nom
    ) {

        return ResponseEntity.ok(
                utilisateurService.searchByNom(nom)
        );
    }

    // Modifier un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur>
    updateUtilisateur(
            @PathVariable Long id,
            @RequestBody Utilisateur utilisateur
    ) {

        return ResponseEntity.ok(
                utilisateurService.updateUtilisateur(
                        id,
                        utilisateur
                )
        );
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
}
