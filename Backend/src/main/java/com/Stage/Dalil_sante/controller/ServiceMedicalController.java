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

import com.Stage.Dalil_sante.entity.ServiceMedical;
import com.Stage.Dalil_sante.service.ServiceMedicalService;

@RestController
@RequestMapping("/api/services-medicaux")
public class ServiceMedicalController {

    private final ServiceMedicalService serviceMedicalService;

    public ServiceMedicalController(
            ServiceMedicalService serviceMedicalService
    ) {
        this.serviceMedicalService = serviceMedicalService;
    }

    // Ajouter un service médical
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ServiceMedical> createService(
            @RequestBody ServiceMedical serviceMedical
    ) {

        ServiceMedical createdService =
                serviceMedicalService.createService(
                        serviceMedical
                );

        return ResponseEntity.ok(createdService);
    }

    // Récupérer tous les services médicaux
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping
    public ResponseEntity<List<ServiceMedical>>
    getAllServices() {

        return ResponseEntity.ok(
                serviceMedicalService.getAllServices()
        );
    }

    // Récupérer uniquement les services actifs
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/active")
    public ResponseEntity<List<ServiceMedical>>
    getActiveServices() {

        return ResponseEntity.ok(
                serviceMedicalService.getActiveServices()
        );
    }

    // Récupérer un service par son ID
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<ServiceMedical> getServiceById(
            @PathVariable Long id
    ) {

        return serviceMedicalService
                .getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Modifier un service médical
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceMedical> updateService(
            @PathVariable Long id,
            @RequestBody ServiceMedical serviceMedical
    ) {

        ServiceMedical updatedService =
                serviceMedicalService.updateService(
                        id,
                        serviceMedical
                );

        return ResponseEntity.ok(updatedService);
    }

    // Supprimer un service médical
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(
            @PathVariable Long id
    ) {

        serviceMedicalService.deleteService(id);

        return ResponseEntity.noContent().build();
    }
}