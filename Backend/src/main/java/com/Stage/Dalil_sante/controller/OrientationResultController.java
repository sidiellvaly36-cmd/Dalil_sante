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

import com.Stage.Dalil_sante.dto.OrientationResultRequest;
import com.Stage.Dalil_sante.dto.OrientationResultResponse;
import com.Stage.Dalil_sante.entity.OrientationResult;
import com.Stage.Dalil_sante.service.OrientationResultService;

import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/api/orientation/results")
public class OrientationResultController {

    private final OrientationResultService orientationResultService;

    public OrientationResultController(
            OrientationResultService orientationResultService
    ) {
        this.orientationResultService =
                orientationResultService;
    }

    // ============================================================
    // AJOUTER UN RÉSULTAT
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<OrientationResultResponse> createResult(
            @RequestBody OrientationResultRequest request
    ) {

        OrientationResult orientationResult =
                new OrientationResult(
                        request.getTitle(),
                        request.getDescription(),
                        request.getUrgencyLevel(),
                        request.getRecommendedSpecialty(),
                        request.getRecommendedEstablishmentType(),
                        request.getActive()
                );

        OrientationResult createdResult =
                orientationResultService.createResult(
                        orientationResult
                );

        return ResponseEntity.ok(
                toResponse(createdResult)
        );
    }

    // ============================================================
    // RÉCUPÉRER TOUS LES RÉSULTATS
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping
    public ResponseEntity<List<OrientationResultResponse>>
    getAllResults() {

        List<OrientationResultResponse> results =
                orientationResultService
                        .getAllResults()
                        .stream()
                        .map(OrientationResultController::toResponse)
                        .toList();

        return ResponseEntity.ok(results);
    }

    // ============================================================
    // RÉCUPÉRER UNIQUEMENT LES RÉSULTATS ACTIFS
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/active")
    public ResponseEntity<List<OrientationResultResponse>>
    getActiveResults() {

        List<OrientationResultResponse> results =
                orientationResultService
                        .getActiveResults()
                        .stream()
                        .map(OrientationResultController::toResponse)
                        .toList();

        return ResponseEntity.ok(results);
    }

    // ============================================================
    // RÉCUPÉRER UN RÉSULTAT PAR ID
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/{id}")
    public ResponseEntity<OrientationResultResponse> getResultById(
            @PathVariable Long id
    ) {

        return orientationResultService
                .getResultById(id)
                .map(OrientationResultController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================
    // RÉCUPÉRER LES RÉSULTATS PAR NIVEAU D'URGENCE
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/urgency/{urgencyLevel}")
    public ResponseEntity<List<OrientationResultResponse>>
    getResultsByUrgencyLevel(
            @PathVariable String urgencyLevel
    ) {

        List<OrientationResultResponse> results =
                orientationResultService
                        .getResultsByUrgencyLevel(urgencyLevel)
                        .stream()
                        .map(OrientationResultController::toResponse)
                        .toList();

        return ResponseEntity.ok(results);
    }

    // ============================================================
    // MODIFIER UN RÉSULTAT
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<OrientationResultResponse> updateResult(
            @PathVariable Long id,
            @RequestBody OrientationResultRequest request
    ) {

        OrientationResult orientationResult =
                new OrientationResult(
                        request.getTitle(),
                        request.getDescription(),
                        request.getUrgencyLevel(),
                        request.getRecommendedSpecialty(),
                        request.getRecommendedEstablishmentType(),
                        request.getActive()
                );

        OrientationResult updatedResult =
                orientationResultService.updateResult(
                        id,
                        orientationResult
                );

        return ResponseEntity.ok(
                toResponse(updatedResult)
        );
    }

    // ============================================================
    // SUPPRIMER UN RÉSULTAT
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(
            @PathVariable Long id
    ) {

        orientationResultService.deleteResult(id);

        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // CONVERSION ENTITY → RESPONSE
    // ============================================================

    private static OrientationResultResponse toResponse(
            OrientationResult orientationResult
    ) {

        return new OrientationResultResponse(
                orientationResult.getId(),
                orientationResult.getTitle(),
                orientationResult.getDescription(),
                orientationResult.getUrgencyLevel(),
                orientationResult.getRecommendedSpecialty(),
                orientationResult.getRecommendedEstablishmentType(),
                orientationResult.getActive()
        );
    }
}