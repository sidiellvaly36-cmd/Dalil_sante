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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Stage.Dalil_sante.dto.EtablissementCreateRequest;
import com.Stage.Dalil_sante.dto.EtablissementResponse;
import com.Stage.Dalil_sante.dto.EtablissementUpdateRequest;
import com.Stage.Dalil_sante.dto.IdNomResponse;
import com.Stage.Dalil_sante.entity.EtablissementSante;
import com.Stage.Dalil_sante.service.EtablissementSanteService;

import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/api/etablissements")
public class EtablissementSanteController {

    private final EtablissementSanteService etablissementService;

    public EtablissementSanteController(
            EtablissementSanteService etablissementService
    ) {
        this.etablissementService = etablissementService;
    }

    // ============================================================
    // CRÉER UN ÉTABLISSEMENT
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/type/{typeId}")
    public ResponseEntity<EtablissementResponse> createEtablissement(
            @PathVariable Long typeId,
            @RequestBody EtablissementCreateRequest request
    ) {
        EtablissementSante etablissement = new EtablissementSante(
                request.getNom(),
                request.getTelephone(),
                request.getEmail(),
                request.getDescription(),
                request.getOuvert24h(),
                request.getActif(),
                null
        );

        EtablissementSante created =
                etablissementService.createEtablissement(
                        typeId,
                        etablissement
                );

        return ResponseEntity.ok(toResponse(created));
    }

    // ============================================================
    // RÉCUPÉRER TOUS LES ÉTABLISSEMENTS
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping
    public ResponseEntity<List<EtablissementResponse>>
    getAllEtablissements() {

        List<EtablissementResponse> etablissements =
                etablissementService.getAllEtablissements()
                        .stream()
                        .map(EtablissementSanteController::toResponse)
                        .toList();

        return ResponseEntity.ok(etablissements);
    }

    // ============================================================
    // RÉCUPÉRER LES ÉTABLISSEMENTS ACTIFS
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/active")
    public ResponseEntity<List<EtablissementResponse>>
    getActiveEtablissements() {

        List<EtablissementResponse> etablissements =
                etablissementService.getActiveEtablissements()
                        .stream()
                        .map(EtablissementSanteController::toResponse)
                        .toList();

        return ResponseEntity.ok(etablissements);
    }

    // ============================================================
    // RÉCUPÉRER UN ÉTABLISSEMENT PAR ID
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/{id}")
    public ResponseEntity<EtablissementResponse>
    getEtablissementById(
            @PathVariable Long id
    ) {

        return etablissementService
                .getEtablissementById(id)
                .map(EtablissementSanteController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================
    // RECHERCHER PAR NOM
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/search")
    public ResponseEntity<List<EtablissementResponse>>
    searchByNom(
            @RequestParam String nom
    ) {

        List<EtablissementResponse> etablissements =
                etablissementService.searchByNom(nom)
                        .stream()
                        .map(EtablissementSanteController::toResponse)
                        .toList();

        return ResponseEntity.ok(etablissements);
    }

    // ============================================================
    // RÉCUPÉRER LES ÉTABLISSEMENTS PAR TYPE
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/type/{typeId}")
    public ResponseEntity<List<EtablissementResponse>>
    getByType(
            @PathVariable Long typeId
    ) {

        List<EtablissementResponse> etablissements =
                etablissementService.getByType(typeId)
                        .stream()
                        .map(EtablissementSanteController::toResponse)
                        .toList();

        return ResponseEntity.ok(etablissements);
    }

    // ============================================================
    // AJOUTER UNE SPÉCIALITÉ À UN ÉTABLISSEMENT
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{etablissementId}/specialites/{specialiteId}")
    public ResponseEntity<EtablissementResponse> addSpecialite(
            @PathVariable Long etablissementId,
            @PathVariable Long specialiteId
    ) {

        EtablissementSante updated =
                etablissementService.addSpecialite(
                        etablissementId,
                        specialiteId
                );

        return ResponseEntity.ok(toResponse(updated));
    }

    // ============================================================
    // AJOUTER UN SERVICE À UN ÉTABLISSEMENT
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{etablissementId}/services/{serviceId}")
    public ResponseEntity<EtablissementResponse> addService(
            @PathVariable Long etablissementId,
            @PathVariable Long serviceId
    ) {

        EtablissementSante updated =
                etablissementService.addService(
                        etablissementId,
                        serviceId
                );

        return ResponseEntity.ok(toResponse(updated));
    }

    // ============================================================
    // MODIFIER UN ÉTABLISSEMENT
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<EtablissementResponse>
    updateEtablissement(
            @PathVariable Long id,
            @RequestBody EtablissementUpdateRequest request
    ) {

        EtablissementSante etablissement = new EtablissementSante(
                request.getNom(),
                request.getTelephone(),
                request.getEmail(),
                request.getDescription(),
                request.getOuvert24h(),
                request.getActif(),
                null
        );

        EtablissementSante updated =
                etablissementService.updateEtablissement(
                        id,
                        etablissement
                );

        return ResponseEntity.ok(toResponse(updated));
    }

    // ============================================================
    // SUPPRIMER UN ÉTABLISSEMENT
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtablissement(
            @PathVariable Long id
    ) {

        etablissementService.deleteEtablissement(id);

        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // CONVERSION ENTITY → RESPONSE
    // ============================================================

    private static EtablissementResponse toResponse(
            EtablissementSante etablissement
    ) {

        List<IdNomResponse> specialites =
                etablissement.getSpecialites()
                        .stream()
                        .map(specialite -> new IdNomResponse(
                                specialite.getId(),
                                specialite.getNom()
                        ))
                        .toList();

        List<IdNomResponse> services =
                etablissement.getServices()
                        .stream()
                        .map(service -> new IdNomResponse(
                                service.getId(),
                                service.getNom()
                        ))
                        .toList();

        Long typeEtablissementId =
                etablissement.getTypeEtablissement() != null
                        ? etablissement.getTypeEtablissement().getId()
                        : null;

        String typeEtablissementNom =
                etablissement.getTypeEtablissement() != null
                        ? etablissement.getTypeEtablissement().getNom()
                        : null;

        return new EtablissementResponse(
                etablissement.getId(),
                etablissement.getNom(),
                etablissement.getTelephone(),
                etablissement.getEmail(),
                etablissement.getDescription(),
                etablissement.getOuvert24h(),
                etablissement.getActif(),
                typeEtablissementId,
                typeEtablissementNom,
                specialites,
                services
        );
    }
}