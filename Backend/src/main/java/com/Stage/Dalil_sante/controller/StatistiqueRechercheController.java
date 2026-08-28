package com.Stage.Dalil_sante.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Stage.Dalil_sante.dto.RechercheLogRequest;
import com.Stage.Dalil_sante.dto.StatistiqueRechercheResponse;
import com.Stage.Dalil_sante.service.RechercheLogService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/statistiques/recherches")
public class StatistiqueRechercheController {

    private final RechercheLogService rechercheLogService;

    public StatistiqueRechercheController(RechercheLogService rechercheLogService) {
        this.rechercheLogService = rechercheLogService;
    }

    /**
     * Enregistre une recherche réellement exécutée par l'UTILISATEUR qui la
     * réalise (ou un ADMIN testant la recherche) - jamais appelé à chaque
     * frappe clavier côté Frontend (voir UserSearch.tsx).
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @PostMapping
    public ResponseEntity<Void> enregistrerRecherche(
            @Valid @RequestBody RechercheLogRequest request,
            Authentication authentication
    ) {

        rechercheLogService.enregistrerRecherche(
                request.getType(),
                request.getQuery(),
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    /**
     * Statistiques de recherche réservées à l'ADMIN (exigence explicite du
     * cahier des charges : "consulter les statistiques de recherche").
     * Toute l'agrégation est calculée par PostgreSQL, jamais par le Frontend.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<StatistiqueRechercheResponse> getStatistiques() {
        return ResponseEntity.ok(rechercheLogService.getStatistiques());
    }
}