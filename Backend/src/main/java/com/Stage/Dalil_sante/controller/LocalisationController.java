package com.Stage.Dalil_sante.controller;

import com.Stage.Dalil_sante.entity.Localisation;
import com.Stage.Dalil_sante.service.LocalisationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @PostMapping("/etablissement/{etablissementId}")
    public ResponseEntity<Localisation> createLocalisation(
            @PathVariable Long etablissementId,
            @RequestBody Localisation localisation
    ) {

        return ResponseEntity.ok(
                localisationService.createLocalisation(
                        etablissementId,
                        localisation
                )
        );
    }

    // Récupérer toutes les localisations
    @GetMapping
    public ResponseEntity<List<Localisation>>
    getAllLocalisations() {

        return ResponseEntity.ok(
                localisationService.getAllLocalisations()
        );
    }

    // Récupérer une localisation par ID
    @GetMapping("/{id}")
    public ResponseEntity<Localisation>
    getLocalisationById(
            @PathVariable Long id
    ) {

        return localisationService
                .getLocalisationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Récupérer la localisation d'un établissement
    @GetMapping("/etablissement/{etablissementId}")
    public ResponseEntity<Localisation>
    getLocalisationByEtablissement(
            @PathVariable Long etablissementId
    ) {

        return localisationService
                .getLocalisationByEtablissement(
                        etablissementId
                )
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Rechercher par ville
    @GetMapping("/ville/{ville}")
    public ResponseEntity<List<Localisation>>
    getLocalisationsByVille(
            @PathVariable String ville
    ) {

        return ResponseEntity.ok(
                localisationService
                        .getLocalisationsByVille(ville)
        );
    }

    // Rechercher par quartier
    @GetMapping("/quartier/{quartier}")
    public ResponseEntity<List<Localisation>>
    getLocalisationsByQuartier(
            @PathVariable String quartier
    ) {

        return ResponseEntity.ok(
                localisationService
                        .getLocalisationsByQuartier(quartier)
        );
    }

    // Modifier une localisation
    @PutMapping("/{id}")
    public ResponseEntity<Localisation>
    updateLocalisation(
            @PathVariable Long id,
            @RequestBody Localisation localisation
    ) {

        return ResponseEntity.ok(
                localisationService.updateLocalisation(
                        id,
                        localisation
                )
        );
    }

    // Supprimer une localisation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocalisation(
            @PathVariable Long id
    ) {

        localisationService.deleteLocalisation(id);

        return ResponseEntity.noContent().build();
    }
}
