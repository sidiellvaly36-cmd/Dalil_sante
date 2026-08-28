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

import com.Stage.Dalil_sante.dto.ServiceMedicalRequest;
import com.Stage.Dalil_sante.dto.ServiceMedicalResponse;
import com.Stage.Dalil_sante.entity.ServiceMedical;
import com.Stage.Dalil_sante.service.ServiceMedicalService;

import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/api/services-medicaux")
public class ServiceMedicalController {

    private final ServiceMedicalService serviceMedicalService;

    public ServiceMedicalController(
            ServiceMedicalService serviceMedicalService
    ) {
        this.serviceMedicalService = serviceMedicalService;
    }

    // ============================================================
    // AJOUTER UN SERVICE MÉDICAL
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ServiceMedicalResponse> createService(
            @RequestBody ServiceMedicalRequest request
    ) {

        ServiceMedical serviceMedical = new ServiceMedical(
                request.getNom(),
                request.getDescription(),
                request.getActif()
        );

        ServiceMedical createdService =
                serviceMedicalService.createService(
                        serviceMedical
                );

        return ResponseEntity.ok(toResponse(createdService));
    }

    // ============================================================
    // RÉCUPÉRER TOUS LES SERVICES MÉDICAUX
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping
    public ResponseEntity<List<ServiceMedicalResponse>>
    getAllServices() {

        List<ServiceMedicalResponse> services =
                serviceMedicalService.getAllServices()
                        .stream()
                        .map(ServiceMedicalController::toResponse)
                        .toList();

        return ResponseEntity.ok(services);
    }

    // ============================================================
    // RÉCUPÉRER UNIQUEMENT LES SERVICES ACTIFS
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/active")
    public ResponseEntity<List<ServiceMedicalResponse>>
    getActiveServices() {

        List<ServiceMedicalResponse> services =
                serviceMedicalService.getActiveServices()
                        .stream()
                        .map(ServiceMedicalController::toResponse)
                        .toList();

        return ResponseEntity.ok(services);
    }

    // ============================================================
    // RÉCUPÉRER UN SERVICE PAR SON ID
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/{id}")
    public ResponseEntity<ServiceMedicalResponse> getServiceById(
            @PathVariable Long id
    ) {

        return serviceMedicalService
                .getServiceById(id)
                .map(ServiceMedicalController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================
    // MODIFIER UN SERVICE MÉDICAL
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceMedicalResponse> updateService(
            @PathVariable Long id,
            @RequestBody ServiceMedicalRequest request
    ) {

        ServiceMedical serviceMedical = new ServiceMedical(
                request.getNom(),
                request.getDescription(),
                request.getActif()
        );

        ServiceMedical updatedService =
                serviceMedicalService.updateService(
                        id,
                        serviceMedical
                );

        return ResponseEntity.ok(toResponse(updatedService));
    }

    // ============================================================
    // SUPPRIMER UN SERVICE MÉDICAL
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(
            @PathVariable Long id
    ) {

        serviceMedicalService.deleteService(id);

        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // CONVERSION ENTITY → RESPONSE
    // ============================================================

    private static ServiceMedicalResponse toResponse(
            ServiceMedical serviceMedical
    ) {

        return new ServiceMedicalResponse(
                serviceMedical.getId(),
                serviceMedical.getNom(),
                serviceMedical.getDescription(),
                serviceMedical.getActif()
        );
    }
}