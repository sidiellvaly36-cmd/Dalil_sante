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

import com.Stage.Dalil_sante.entity.TypeEtablissement;
import com.Stage.Dalil_sante.service.TypeEtablissementService;

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
    public ResponseEntity<TypeEtablissement> createType(
            @RequestBody TypeEtablissement typeEtablissement
    ) {

        TypeEtablissement createdType =
                typeEtablissementService.createType(
                        typeEtablissement
                );

        return ResponseEntity.ok(createdType);
    }

    // Récupérer tous les types
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping
    public ResponseEntity<List<TypeEtablissement>>
    getAllTypes() {

        return ResponseEntity.ok(
                typeEtablissementService.getAllTypes()
        );
    }

    // Récupérer uniquement les types actifs
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/active")
    public ResponseEntity<List<TypeEtablissement>>
    getActiveTypes() {

        return ResponseEntity.ok(
                typeEtablissementService.getActiveTypes()
        );
    }

    // Récupérer un type par ID
    @PreAuthorize("hasAnyRole('ADMIN', 'UTILISATEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<TypeEtablissement> getTypeById(
            @PathVariable Long id
    ) {

        return typeEtablissementService
                .getTypeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Modifier un type
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<TypeEtablissement> updateType(
            @PathVariable Long id,
            @RequestBody TypeEtablissement typeEtablissement
    ) {

        TypeEtablissement updatedType =
                typeEtablissementService.updateType(
                        id,
                        typeEtablissement
                );

        return ResponseEntity.ok(updatedType);
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
}