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

import com.Stage.Dalil_sante.entity.EtablissementSante;
import com.Stage.Dalil_sante.service.EtablissementSanteService;

@RestController
@RequestMapping("/api/etablissements")
public class EtablissementSanteController {

    private final EtablissementSanteService etablissementService;

    public EtablissementSanteController(
            EtablissementSanteService etablissementService
    ) {
        this.etablissementService = etablissementService;
    }

    // Créer un établissement
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/type/{typeId}")
    public ResponseEntity<EtablissementSante> createEtablissement(
            @PathVariable Long typeId,
            @RequestBody EtablissementSante etablissement
    ) {

        return ResponseEntity.ok(
                etablissementService.createEtablissement(
                        typeId,
                        etablissement
                )
        );
    }

    // Récupérer tous les établissements
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping
    public ResponseEntity<List<EtablissementSante>>
    getAllEtablissements() {

        return ResponseEntity.ok(
                etablissementService.getAllEtablissements()
        );
    }

    // Récupérer les établissements actifs
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/active")
    public ResponseEntity<List<EtablissementSante>>
    getActiveEtablissements() {

        return ResponseEntity.ok(
                etablissementService.getActiveEtablissements()
        );
    }

    // Récupérer un établissement par ID
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<EtablissementSante>
    getEtablissementById(
            @PathVariable Long id
    ) {

        return etablissementService
                .getEtablissementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Rechercher par nom
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/search")
    public ResponseEntity<List<EtablissementSante>>
    searchByNom(
            @RequestParam String nom
    ) {

        return ResponseEntity.ok(
                etablissementService.searchByNom(nom)
        );
    }

    // Récupérer les établissements par type
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/type/{typeId}")
    public ResponseEntity<List<EtablissementSante>>
    getByType(
            @PathVariable Long typeId
    ) {

        return ResponseEntity.ok(
                etablissementService.getByType(typeId)
        );
    }

    // Ajouter une spécialité à un établissement
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{etablissementId}/specialites/{specialiteId}")
    public ResponseEntity<EtablissementSante> addSpecialite(
            @PathVariable Long etablissementId,
            @PathVariable Long specialiteId
    ) {

        return ResponseEntity.ok(
                etablissementService.addSpecialite(
                        etablissementId,
                        specialiteId
                )
        );
    }

    // Ajouter un service à un établissement
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{etablissementId}/services/{serviceId}")
    public ResponseEntity<EtablissementSante> addService(
            @PathVariable Long etablissementId,
            @PathVariable Long serviceId
    ) {

        return ResponseEntity.ok(
                etablissementService.addService(
                        etablissementId,
                        serviceId
                )
        );
    }

    // Modifier un établissement
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<EtablissementSante>
    updateEtablissement(
            @PathVariable Long id,
            @RequestBody EtablissementSante etablissement
    ) {

        return ResponseEntity.ok(
                etablissementService.updateEtablissement(
                        id,
                        etablissement
                )
        );
    }

    // Supprimer un établissement
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtablissement(
            @PathVariable Long id
    ) {

        etablissementService.deleteEtablissement(id);

        return ResponseEntity.noContent().build();
    }
}