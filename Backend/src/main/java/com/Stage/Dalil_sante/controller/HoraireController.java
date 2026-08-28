package com.Stage.Dalil_sante.controller;

import java.time.DayOfWeek;
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

import com.Stage.Dalil_sante.dto.HoraireRequest;
import com.Stage.Dalil_sante.dto.HoraireResponse;
import com.Stage.Dalil_sante.entity.Horaire;
import com.Stage.Dalil_sante.service.HoraireService;

@RestController
@RequestMapping("/api/horaires")
public class HoraireController {

    private final HoraireService horaireService;

    public HoraireController(
            HoraireService horaireService
    ) {
        this.horaireService = horaireService;
    }

    // Ajouter un horaire à un établissement
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/etablissement/{etablissementId}")
    public ResponseEntity<HoraireResponse> createHoraire(
            @PathVariable Long etablissementId,
            @RequestBody HoraireRequest request
    ) {

        Horaire horaire = new Horaire(
                request.getJourSemaine(),
                request.getHeureOuverture(),
                request.getHeureFermeture(),
                request.getFerme(),
                null
        );

        Horaire createdHoraire =
                horaireService.createHoraire(
                        etablissementId,
                        horaire
                );

        return ResponseEntity.ok(toResponse(createdHoraire));
    }

    // Récupérer tous les horaires
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping
    public ResponseEntity<List<HoraireResponse>>
    getAllHoraires() {

        List<HoraireResponse> horaires =
                horaireService.getAllHoraires()
                        .stream()
                        .map(HoraireController::toResponse)
                        .toList();

        return ResponseEntity.ok(horaires);
    }

    // Récupérer un horaire par ID
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<HoraireResponse>
    getHoraireById(
            @PathVariable Long id
    ) {

        return horaireService
                .getHoraireById(id)
                .map(HoraireController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Récupérer tous les horaires d'un établissement
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/etablissement/{etablissementId}")
    public ResponseEntity<List<HoraireResponse>>
    getHorairesByEtablissement(
            @PathVariable Long etablissementId
    ) {

        List<HoraireResponse> horaires =
                horaireService
                        .getHorairesByEtablissement(
                                etablissementId
                        )
                        .stream()
                        .map(HoraireController::toResponse)
                        .toList();

        return ResponseEntity.ok(horaires);
    }

    // Récupérer l'horaire d'un jour précis
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/etablissement/{etablissementId}/jour/{jourSemaine}")
    public ResponseEntity<HoraireResponse>
    getHoraireByJour(
            @PathVariable Long etablissementId,
            @PathVariable DayOfWeek jourSemaine
    ) {

        return horaireService
                .getHoraireByJour(
                        etablissementId,
                        jourSemaine
                )
                .map(HoraireController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Modifier un horaire
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<HoraireResponse>
    updateHoraire(
            @PathVariable Long id,
            @RequestBody HoraireRequest request
    ) {

        Horaire horaire = new Horaire(
                request.getJourSemaine(),
                request.getHeureOuverture(),
                request.getHeureFermeture(),
                request.getFerme(),
                null
        );

        Horaire updatedHoraire =
                horaireService.updateHoraire(
                        id,
                        horaire
                );

        return ResponseEntity.ok(toResponse(updatedHoraire));
    }

    // Supprimer un horaire
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteHoraire(
            @PathVariable Long id
    ) {

        horaireService.deleteHoraire(id);

        return ResponseEntity.noContent().build();
    }

    private static HoraireResponse toResponse(
            Horaire horaire
    ) {

        Long etablissementId = horaire.getEtablissement() != null
                ? horaire.getEtablissement().getId()
                : null;

        return new HoraireResponse(
                horaire.getId(),
                horaire.getJourSemaine(),
                horaire.getHeureOuverture(),
                horaire.getHeureFermeture(),
                horaire.getFerme(),
                etablissementId
        );
    }
}