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

import com.Stage.Dalil_sante.dto.TypeEtablissementRequest;
import com.Stage.Dalil_sante.dto.TypeEtablissementResponse;
import com.Stage.Dalil_sante.entity.TypeEtablissement;
import com.Stage.Dalil_sante.service.TypeEtablissementService;

import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/api/types-etablissement")
public class TypeEtablissementController {

    private final TypeEtablissementService typeEtablissementService;

    public TypeEtablissementController(
            TypeEtablissementService typeEtablissementService
    ) {
        this.typeEtablissementService =
                typeEtablissementService;
    }

    // Ajouter un type d'établissement
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<TypeEtablissementResponse> createType(
            @RequestBody TypeEtablissementRequest request
    ) {

        TypeEtablissement typeEtablissement = new TypeEtablissement(
                request.getNom(),
                request.getDescription(),
                request.getActif()
        );

        TypeEtablissement createdType =
                typeEtablissementService.createType(
                        typeEtablissement
                );

        return ResponseEntity.ok(toResponse(createdType));
    }

    // Récupérer tous les types
    @PermitAll
    @GetMapping
    public ResponseEntity<List<TypeEtablissementResponse>>
    getAllTypes() {

        List<TypeEtablissementResponse> types =
                typeEtablissementService.getAllTypes()
                        .stream()
                        .map(TypeEtablissementController::toResponse)
                        .toList();

        return ResponseEntity.ok(types);
    }

    // Récupérer uniquement les types actifs
    @PermitAll
    @GetMapping("/active")
    public ResponseEntity<List<TypeEtablissementResponse>>
    getActiveTypes() {

        List<TypeEtablissementResponse> types =
                typeEtablissementService.getActiveTypes()
                        .stream()
                        .map(TypeEtablissementController::toResponse)
                        .toList();

        return ResponseEntity.ok(types);
    }

    // Récupérer un type par ID
    @PermitAll
    @GetMapping("/{id}")
    public ResponseEntity<TypeEtablissementResponse> getTypeById(
            @PathVariable Long id
    ) {

        return typeEtablissementService
                .getTypeById(id)
                .map(TypeEtablissementController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Modifier un type
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<TypeEtablissementResponse> updateType(
            @PathVariable Long id,
            @RequestBody TypeEtablissementRequest request
    ) {

        TypeEtablissement typeEtablissement = new TypeEtablissement(
                request.getNom(),
                request.getDescription(),
                request.getActif()
        );

        TypeEtablissement updatedType =
                typeEtablissementService.updateType(
                        id,
                        typeEtablissement
                );

        return ResponseEntity.ok(toResponse(updatedType));
    }

    // Supprimer un type
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteType(
            @PathVariable Long id
    ) {

        typeEtablissementService.deleteType(id);

        return ResponseEntity.noContent().build();
    }

    private static TypeEtablissementResponse toResponse(
            TypeEtablissement typeEtablissement
    ) {

        return new TypeEtablissementResponse(
                typeEtablissement.getId(),
                typeEtablissement.getNom(),
                typeEtablissement.getDescription(),
                typeEtablissement.getActif()
        );
    }
}