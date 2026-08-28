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

import com.Stage.Dalil_sante.dto.SpecialiteMedicaleRequest;
import com.Stage.Dalil_sante.dto.SpecialiteMedicaleResponse;
import com.Stage.Dalil_sante.entity.SpecialiteMedicale;
import com.Stage.Dalil_sante.service.SpecialiteMedicaleService;

import jakarta.annotation.security.PermitAll;

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

    // ============================================================
    // AJOUTER UNE SPÉCIALITÉ MÉDICALE
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<SpecialiteMedicaleResponse> createSpecialite(
            @RequestBody SpecialiteMedicaleRequest request
    ) {

        SpecialiteMedicale specialiteMedicale =
                new SpecialiteMedicale(
                        request.getNom(),
                        request.getDescription(),
                        request.getActif()
                );

        SpecialiteMedicale createdSpecialite =
                specialiteMedicaleService.createSpecialite(
                        specialiteMedicale
                );

        return ResponseEntity.ok(
                toResponse(createdSpecialite)
        );
    }

    // ============================================================
    // RÉCUPÉRER TOUTES LES SPÉCIALITÉS
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping
    public ResponseEntity<List<SpecialiteMedicaleResponse>>
    getAllSpecialites() {

        List<SpecialiteMedicaleResponse> specialites =
                specialiteMedicaleService.getAllSpecialites()
                        .stream()
                        .map(SpecialiteMedicaleController::toResponse)
                        .toList();

        return ResponseEntity.ok(specialites);
    }

    // ============================================================
    // RÉCUPÉRER UNIQUEMENT LES SPÉCIALITÉS ACTIVES
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/active")
    public ResponseEntity<List<SpecialiteMedicaleResponse>>
    getActiveSpecialites() {

        List<SpecialiteMedicaleResponse> specialites =
                specialiteMedicaleService.getActiveSpecialites()
                        .stream()
                        .map(SpecialiteMedicaleController::toResponse)
                        .toList();

        return ResponseEntity.ok(specialites);
    }

    // ============================================================
    // RÉCUPÉRER UNE SPÉCIALITÉ PAR ID
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/{id}")
    public ResponseEntity<SpecialiteMedicaleResponse>
    getSpecialiteById(
            @PathVariable Long id
    ) {

        return specialiteMedicaleService
                .getSpecialiteById(id)
                .map(SpecialiteMedicaleController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================
    // MODIFIER UNE SPÉCIALITÉ
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<SpecialiteMedicaleResponse>
    updateSpecialite(
            @PathVariable Long id,
            @RequestBody SpecialiteMedicaleRequest request
    ) {

        SpecialiteMedicale specialiteMedicale =
                new SpecialiteMedicale(
                        request.getNom(),
                        request.getDescription(),
                        request.getActif()
                );

        SpecialiteMedicale updatedSpecialite =
                specialiteMedicaleService.updateSpecialite(
                        id,
                        specialiteMedicale
                );

        return ResponseEntity.ok(
                toResponse(updatedSpecialite)
        );
    }

    // ============================================================
    // SUPPRIMER UNE SPÉCIALITÉ
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecialite(
            @PathVariable Long id
    ) {

        specialiteMedicaleService.deleteSpecialite(id);

        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // CONVERSION ENTITY → RESPONSE
    // ============================================================

    private static SpecialiteMedicaleResponse toResponse(
            SpecialiteMedicale specialiteMedicale
    ) {

        return new SpecialiteMedicaleResponse(
                specialiteMedicale.getId(),
                specialiteMedicale.getNom(),
                specialiteMedicale.getDescription(),
                specialiteMedicale.getActif()
        );
    }
}