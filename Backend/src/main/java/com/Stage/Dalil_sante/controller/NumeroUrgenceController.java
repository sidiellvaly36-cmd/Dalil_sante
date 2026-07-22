package com.Stage.Dalil_sante.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Stage.Dalil_sante.entity.NumeroUrgence;
import com.Stage.Dalil_sante.service.NumeroUrgenceService;

@RestController
@RequestMapping("/api/numeros-urgence")
public class NumeroUrgenceController {

    private final NumeroUrgenceService numeroUrgenceService;

    public NumeroUrgenceController(NumeroUrgenceService numeroUrgenceService) {
        this.numeroUrgenceService = numeroUrgenceService;
    }

    // Ajouter un numéro d'urgence
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<NumeroUrgence> createNumeroUrgence(
            @RequestBody NumeroUrgence numeroUrgence) {

        return ResponseEntity.ok(
                numeroUrgenceService.createNumeroUrgence(numeroUrgence)
        );
    }

    // Récupérer tous les numéros d'urgence
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping
    public ResponseEntity<List<NumeroUrgence>> getAllNumerosUrgence() {

        return ResponseEntity.ok(
                numeroUrgenceService.getAllNumerosUrgence()
        );
    }

    // Récupérer un numéro d'urgence par ID
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<NumeroUrgence> getNumeroUrgenceById(
            @PathVariable Long id) {

        return numeroUrgenceService.getNumeroUrgenceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Modifier un numéro d'urgence
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<NumeroUrgence> updateNumeroUrgence(
            @PathVariable Long id,
            @RequestBody NumeroUrgence numeroUrgence) {

        return ResponseEntity.ok(
                numeroUrgenceService.updateNumeroUrgence(id, numeroUrgence)
        );
    }

    // Supprimer un numéro d'urgence
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNumeroUrgence(
            @PathVariable Long id) {

        numeroUrgenceService.deleteNumeroUrgence(id);

        return ResponseEntity.noContent().build();
    }
}