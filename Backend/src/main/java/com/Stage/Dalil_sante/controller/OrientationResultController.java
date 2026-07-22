package com.Stage.Dalil_sante.controller;

import com.Stage.Dalil_sante.entity.OrientationResult;
import com.Stage.Dalil_sante.service.OrientationResultService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // Ajouter un résultat
    @PostMapping
    public ResponseEntity<OrientationResult> createResult(
            @RequestBody OrientationResult orientationResult
    ) {

        OrientationResult createdResult =
                orientationResultService.createResult(
                        orientationResult
                );

        return ResponseEntity.ok(createdResult);
    }

    // Récupérer tous les résultats
    @GetMapping
    public ResponseEntity<List<OrientationResult>>
    getAllResults() {

        return ResponseEntity.ok(
                orientationResultService.getAllResults()
        );
    }

    // Récupérer uniquement les résultats actifs
    @GetMapping("/active")
    public ResponseEntity<List<OrientationResult>>
    getActiveResults() {

        return ResponseEntity.ok(
                orientationResultService.getActiveResults()
        );
    }

    // Récupérer un résultat par ID
    @GetMapping("/{id}")
    public ResponseEntity<OrientationResult> getResultById(
            @PathVariable Long id
    ) {

        return orientationResultService
                .getResultById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Récupérer les résultats par niveau d'urgence
    @GetMapping("/urgency/{urgencyLevel}")
    public ResponseEntity<List<OrientationResult>>
    getResultsByUrgencyLevel(
            @PathVariable String urgencyLevel
    ) {

        return ResponseEntity.ok(
                orientationResultService
                        .getResultsByUrgencyLevel(urgencyLevel)
        );
    }

    // Modifier un résultat
    @PutMapping("/{id}")
    public ResponseEntity<OrientationResult> updateResult(
            @PathVariable Long id,
            @RequestBody OrientationResult orientationResult
    ) {

        OrientationResult updatedResult =
                orientationResultService.updateResult(
                        id,
                        orientationResult
                );

        return ResponseEntity.ok(updatedResult);
    }

    // Supprimer un résultat
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(
            @PathVariable Long id
    ) {

        orientationResultService.deleteResult(id);

        return ResponseEntity.noContent().build();
    }
}
