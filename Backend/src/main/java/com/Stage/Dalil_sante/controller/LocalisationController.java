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

import com.Stage.Dalil_sante.dto.LocalisationRequest;
import com.Stage.Dalil_sante.dto.LocalisationResponse;
import com.Stage.Dalil_sante.entity.Localisation;
import com.Stage.Dalil_sante.service.LocalisationService;

@RestController
@RequestMapping("/api/localisations")
public class LocalisationController {

    private final LocalisationService localisationService;

    public LocalisationController(
            LocalisationService localisationService
    ) {
        this.localisationService = localisationService;
    }

    // Ajouter une localisation à un établissement
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/etablissement/{etablissementId}")
    public ResponseEntity<LocalisationResponse> createLocalisation(
            @PathVariable Long etablissementId,
            @RequestBody LocalisationRequest request
    ) {

        Localisation localisation = new Localisation(
                request.getAdresse(),
                request.getVille(),
                request.getQuartier(),
                request.getLatitude(),
                request.getLongitude(),
                null
        );

        Localisation createdLocalisation =
                localisationService.createLocalisation(
                        etablissementId,
                        localisation
                );

        return ResponseEntity.ok(toResponse(createdLocalisation));
    }

    // Récupérer toutes les localisations
    @GetMapping
    public ResponseEntity<List<LocalisationResponse>>
    getAllLocalisations() {

        List<LocalisationResponse> localisations =
                localisationService.getAllLocalisations()
                        .stream()
                        .map(LocalisationController::toResponse)
                        .toList();

        return ResponseEntity.ok(localisations);
    }

    // Récupérer une localisation par ID
    @GetMapping("/{id}")
    public ResponseEntity<LocalisationResponse>
    getLocalisationById(
            @PathVariable Long id
    ) {

        return localisationService
                .getLocalisationById(id)
                .map(LocalisationController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Récupérer la localisation d'un établissement
    @GetMapping("/etablissement/{etablissementId}")
    public ResponseEntity<LocalisationResponse>
    getLocalisationByEtablissement(
            @PathVariable Long etablissementId
    ) {

        return localisationService
                .getLocalisationByEtablissement(etablissementId)
                .map(LocalisationController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Rechercher par ville
    @GetMapping("/ville/{ville}")
    public ResponseEntity<List<LocalisationResponse>>
    getLocalisationsByVille(
            @PathVariable String ville
    ) {

        List<LocalisationResponse> localisations =
                localisationService
                        .getLocalisationsByVille(ville)
                        .stream()
                        .map(LocalisationController::toResponse)
                        .toList();

        return ResponseEntity.ok(localisations);
    }

    // Rechercher par quartier
    @GetMapping("/quartier/{quartier}")
    public ResponseEntity<List<LocalisationResponse>>
    getLocalisationsByQuartier(
            @PathVariable String quartier
    ) {

        List<LocalisationResponse> localisations =
                localisationService
                        .getLocalisationsByQuartier(quartier)
                        .stream()
                        .map(LocalisationController::toResponse)
                        .toList();

        return ResponseEntity.ok(localisations);
    }

    // Modifier une localisation
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<LocalisationResponse>
    updateLocalisation(
            @PathVariable Long id,
            @RequestBody LocalisationRequest request
    ) {

        Localisation localisation = new Localisation(
                request.getAdresse(),
                request.getVille(),
                request.getQuartier(),
                request.getLatitude(),
                request.getLongitude(),
                null
        );

        Localisation updatedLocalisation =
                localisationService.updateLocalisation(
                        id,
                        localisation
                );

        return ResponseEntity.ok(toResponse(updatedLocalisation));
    }

    // Supprimer une localisation
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocalisation(
            @PathVariable Long id
    ) {

        localisationService.deleteLocalisation(id);

        return ResponseEntity.noContent().build();
    }

    private static LocalisationResponse toResponse(
            Localisation localisation
    ) {

        Long etablissementId =
                localisation.getEtablissement() != null
                        ? localisation.getEtablissement().getId()
                        : null;

        return new LocalisationResponse(
                localisation.getId(),
                localisation.getAdresse(),
                localisation.getVille(),
                localisation.getQuartier(),
                localisation.getLatitude(),
                localisation.getLongitude(),
                etablissementId
        );
    }
}