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

import com.Stage.Dalil_sante.entity.SpecialiteMedicale;
import com.Stage.Dalil_sante.service.SpecialiteMedicaleService;

@RestController
@RequestMapping("/api/specialites-medicales")
public class SpecialiteMedicaleController {

    private final SpecialiteMedicaleService specialiteMedicaleService;

    public SpecialiteMedicaleController(
            SpecialiteMedicaleService specialiteMedicaleService
    ) {
        this.specialiteMedicaleService =
                specialiteMedicaleService;
    }

    // Ajouter une spécialité médicale
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<SpecialiteMedicale> createSpecialite(
            @RequestBody SpecialiteMedicale specialiteMedicale
    ) {

        SpecialiteMedicale createdSpecialite =
                specialiteMedicaleService.createSpecialite(
                        specialiteMedicale
                );

        return ResponseEntity.ok(createdSpecialite);
    }

    // Récupérer toutes les spécialités
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping
    public ResponseEntity<List<SpecialiteMedicale>>
    getAllSpecialites() {

        return ResponseEntity.ok(
                specialiteMedicaleService.getAllSpecialites()
        );
    }

    // Récupérer uniquement les spécialités actives
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/active")
    public ResponseEntity<List<SpecialiteMedicale>>
    getActiveSpecialites() {

        return ResponseEntity.ok(
                specialiteMedicaleService.getActiveSpecialites()
        );
    }

    // Récupérer une spécialité par ID
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<SpecialiteMedicale> getSpecialiteById(
            @PathVariable Long id
    ) {

        return specialiteMedicaleService
                .getSpecialiteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Modifier une spécialité
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<SpecialiteMedicale> updateSpecialite(
            @PathVariable Long id,
            @RequestBody SpecialiteMedicale specialiteMedicale
    ) {

        SpecialiteMedicale updatedSpecialite =
                specialiteMedicaleService.updateSpecialite(
                        id,
                        specialiteMedicale
                );

        return ResponseEntity.ok(updatedSpecialite);
    }

    // Supprimer une spécialité
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecialite(
            @PathVariable Long id
    ) {

        specialiteMedicaleService.deleteSpecialite(id);

        return ResponseEntity.noContent().build();
    }
}