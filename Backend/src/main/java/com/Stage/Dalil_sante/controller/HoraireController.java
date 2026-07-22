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
    public ResponseEntity<Horaire> createHoraire(
            @PathVariable Long etablissementId,
            @RequestBody Horaire horaire
    ) {

        return ResponseEntity.ok(
                horaireService.createHoraire(
                        etablissementId,
                        horaire
                )
        );
    }

    // Récupérer tous les horaires
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping
    public ResponseEntity<List<Horaire>>
    getAllHoraires() {

        return ResponseEntity.ok(
                horaireService.getAllHoraires()
        );
    }

    // Récupérer un horaire par ID
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<Horaire>
    getHoraireById(
            @PathVariable Long id
    ) {

        return horaireService
                .getHoraireById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Récupérer tous les horaires d'un établissement
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/etablissement/{etablissementId}")
    public ResponseEntity<List<Horaire>>
    getHorairesByEtablissement(
            @PathVariable Long etablissementId
    ) {

        return ResponseEntity.ok(
                horaireService
                        .getHorairesByEtablissement(
                                etablissementId
                        )
        );
    }

    // Récupérer l'horaire d'un jour précis
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/etablissement/{etablissementId}/jour/{jourSemaine}")
    public ResponseEntity<Horaire>
    getHoraireByJour(
            @PathVariable Long etablissementId,
            @PathVariable DayOfWeek jourSemaine
    ) {

        return horaireService
                .getHoraireByJour(
                        etablissementId,
                        jourSemaine
                )
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Modifier un horaire
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Horaire>
    updateHoraire(
            @PathVariable Long id,
            @RequestBody Horaire horaire
    ) {

        return ResponseEntity.ok(
                horaireService.updateHoraire(
                        id,
                        horaire
                )
        );
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
}