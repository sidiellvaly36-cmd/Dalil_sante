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

import com.Stage.Dalil_sante.dto.OrientationOptionRequest;
import com.Stage.Dalil_sante.dto.OrientationOptionResponse;
import com.Stage.Dalil_sante.entity.OrientationOption;
import com.Stage.Dalil_sante.service.OrientationOptionService;

import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/api/orientation/options")
public class OrientationOptionController {

    private final OrientationOptionService orientationOptionService;

    public OrientationOptionController(
            OrientationOptionService orientationOptionService
    ) {
        this.orientationOptionService = orientationOptionService;
    }

    // ============================================================
    // AJOUTER UNE OPTION À UNE QUESTION
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/question/{questionId}")
    public ResponseEntity<OrientationOptionResponse> createOption(
            @PathVariable Long questionId,
            @RequestBody OrientationOptionRequest request
    ) {

        OrientationOption orientationOption =
                new OrientationOption(
                        request.getOptionText(),
                        request.getOptionOrder(),
                        request.getActive(),
                        null
                );

        OrientationOption createdOption =
                orientationOptionService.createOption(
                        questionId,
                        orientationOption
                );

        return ResponseEntity.ok(
                toResponse(createdOption)
        );
    }

    // ============================================================
    // RÉCUPÉRER TOUTES LES OPTIONS D'UNE QUESTION
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<OrientationOptionResponse>>
    getOptionsByQuestionId(
            @PathVariable Long questionId
    ) {

        List<OrientationOptionResponse> options =
                orientationOptionService
                        .getOptionsByQuestionId(questionId)
                        .stream()
                        .map(OrientationOptionController::toResponse)
                        .toList();

        return ResponseEntity.ok(options);
    }

    // ============================================================
    // RÉCUPÉRER LES OPTIONS ACTIVES D'UNE QUESTION
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/question/{questionId}/active")
    public ResponseEntity<List<OrientationOptionResponse>>
    getActiveOptionsByQuestionId(
            @PathVariable Long questionId
    ) {

        List<OrientationOptionResponse> options =
                orientationOptionService
                        .getActiveOptionsByQuestionId(questionId)
                        .stream()
                        .map(OrientationOptionController::toResponse)
                        .toList();

        return ResponseEntity.ok(options);
    }

    // ============================================================
    // RÉCUPÉRER UNE OPTION PAR ID
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/{id}")
    public ResponseEntity<OrientationOptionResponse> getOptionById(
            @PathVariable Long id
    ) {

        return orientationOptionService
                .getOptionById(id)
                .map(OrientationOptionController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================
    // MODIFIER UNE OPTION
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<OrientationOptionResponse> updateOption(
            @PathVariable Long id,
            @RequestBody OrientationOptionRequest request
    ) {

        OrientationOption orientationOption =
                new OrientationOption(
                        request.getOptionText(),
                        request.getOptionOrder(),
                        request.getActive(),
                        null
                );

        OrientationOption updatedOption =
                orientationOptionService.updateOption(
                        id,
                        orientationOption
                );

        return ResponseEntity.ok(
                toResponse(updatedOption)
        );
    }

    // ============================================================
    // SUPPRIMER UNE OPTION
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOption(
            @PathVariable Long id
    ) {

        orientationOptionService.deleteOption(id);

        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // CONVERSION ENTITY → RESPONSE
    // ============================================================

    private static OrientationOptionResponse toResponse(
            OrientationOption orientationOption
    ) {

        Long questionId =
                orientationOption.getQuestion() != null
                        ? orientationOption.getQuestion().getId()
                        : null;

        return new OrientationOptionResponse(
                orientationOption.getId(),
                orientationOption.getOptionText(),
                orientationOption.getOptionOrder(),
                orientationOption.getActive(),
                questionId
        );
    }
}