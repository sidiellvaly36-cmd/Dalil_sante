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

import com.Stage.Dalil_sante.dto.NumeroUrgenceRequest;
import com.Stage.Dalil_sante.dto.NumeroUrgenceResponse;
import com.Stage.Dalil_sante.entity.NumeroUrgence;
import com.Stage.Dalil_sante.service.NumeroUrgenceService;

import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/api/numeros-urgence")
public class NumeroUrgenceController {

    private final NumeroUrgenceService numeroUrgenceService;

    public NumeroUrgenceController(NumeroUrgenceService numeroUrgenceService) {
        this.numeroUrgenceService = numeroUrgenceService;
    }

    // ============================================================
    // AJOUTER UN NUMÉRO D'URGENCE
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<NumeroUrgenceResponse> createNumeroUrgence(
            @RequestBody NumeroUrgenceRequest request
    ) {

        NumeroUrgence numeroUrgence = new NumeroUrgence(
                request.getNom(),
                request.getNumero(),
                request.getDescription(),
                null
        );

        NumeroUrgence createdNumeroUrgence =
                numeroUrgenceService.createNumeroUrgence(
                        request.getEtablissementId(),
                        numeroUrgence
                );

        return ResponseEntity.ok(toResponse(createdNumeroUrgence));
    }

    // ============================================================
    // RÉCUPÉRER TOUS LES NUMÉROS D'URGENCE
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping
    public ResponseEntity<List<NumeroUrgenceResponse>> getAllNumerosUrgence() {

        List<NumeroUrgenceResponse> numerosUrgence =
                numeroUrgenceService.getAllNumerosUrgence()
                        .stream()
                        .map(NumeroUrgenceController::toResponse)
                        .toList();

        return ResponseEntity.ok(numerosUrgence);
    }

    // ============================================================
    // RÉCUPÉRER UN NUMÉRO D'URGENCE PAR ID
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/{id}")
    public ResponseEntity<NumeroUrgenceResponse> getNumeroUrgenceById(
            @PathVariable Long id
    ) {

        return numeroUrgenceService
                .getNumeroUrgenceById(id)
                .map(NumeroUrgenceController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================
    // MODIFIER UN NUMÉRO D'URGENCE
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<NumeroUrgenceResponse> updateNumeroUrgence(
            @PathVariable Long id,
            @RequestBody NumeroUrgenceRequest request
    ) {

        NumeroUrgence numeroUrgence = new NumeroUrgence(
                request.getNom(),
                request.getNumero(),
                request.getDescription(),
                null
        );

        NumeroUrgence updatedNumeroUrgence =
                numeroUrgenceService.updateNumeroUrgence(
                        id,
                        request.getEtablissementId(),
                        numeroUrgence
                );

        return ResponseEntity.ok(toResponse(updatedNumeroUrgence));
    }

    // ============================================================
    // SUPPRIMER UN NUMÉRO D'URGENCE
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNumeroUrgence(
            @PathVariable Long id
    ) {

        numeroUrgenceService.deleteNumeroUrgence(id);

        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // CONVERSION ENTITY → RESPONSE
    // ============================================================

    private static NumeroUrgenceResponse toResponse(
            NumeroUrgence numeroUrgence
    ) {

        Long etablissementId =
                numeroUrgence.getEtablissement() != null
                        ? numeroUrgence.getEtablissement().getId()
                        : null;

        String etablissementNom =
                numeroUrgence.getEtablissement() != null
                        ? numeroUrgence.getEtablissement().getNom()
                        : null;

        return new NumeroUrgenceResponse(
                numeroUrgence.getId(),
                numeroUrgence.getNom(),
                numeroUrgence.getNumero(),
                numeroUrgence.getDescription(),
                etablissementId,
                etablissementNom
        );
    }
}