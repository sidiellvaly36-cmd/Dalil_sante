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

import com.Stage.Dalil_sante.dto.OrientationRuleRequest;
import com.Stage.Dalil_sante.dto.OrientationRuleResponse;
import com.Stage.Dalil_sante.entity.OrientationRule;
import com.Stage.Dalil_sante.service.OrientationRuleService;

import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/api/orientation/rules")
public class OrientationRuleController {

    private final OrientationRuleService orientationRuleService;

    public OrientationRuleController(
            OrientationRuleService orientationRuleService
    ) {
        this.orientationRuleService = orientationRuleService;
    }

    // ============================================================
    // AJOUTER UNE RÈGLE
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<OrientationRuleResponse> createRule(
            @RequestParam Long optionId,
            @RequestParam Long resultId,
            @RequestBody OrientationRuleRequest request
    ) {

        OrientationRule orientationRule =
                new OrientationRule(
                        request.getPriority(),
                        request.getActive(),
                        null,
                        null
                );

        OrientationRule createdRule =
                orientationRuleService.createRule(
                        optionId,
                        resultId,
                        orientationRule
                );

        return ResponseEntity.ok(
                toResponse(createdRule)
        );
    }

    // ============================================================
    // RÉCUPÉRER TOUTES LES RÈGLES
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping
    public ResponseEntity<List<OrientationRuleResponse>> getAllRules() {

        List<OrientationRuleResponse> rules =
                orientationRuleService
                        .getAllRules()
                        .stream()
                        .map(OrientationRuleController::toResponse)
                        .toList();

        return ResponseEntity.ok(rules);
    }

    // ============================================================
    // RÉCUPÉRER UNE RÈGLE PAR ID
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/{id}")
    public ResponseEntity<OrientationRuleResponse> getRuleById(
            @PathVariable Long id
    ) {

        return orientationRuleService
                .getRuleById(id)
                .map(OrientationRuleController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================
    // RÉCUPÉRER LES RÈGLES D'UNE OPTION
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/option/{optionId}")
    public ResponseEntity<List<OrientationRuleResponse>>
    getRulesByOptionId(
            @PathVariable Long optionId
    ) {

        List<OrientationRuleResponse> rules =
                orientationRuleService
                        .getRulesByOptionId(optionId)
                        .stream()
                        .map(OrientationRuleController::toResponse)
                        .toList();

        return ResponseEntity.ok(rules);
    }

    // ============================================================
    // MODIFIER UNE RÈGLE
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<OrientationRuleResponse> updateRule(
            @PathVariable Long id,
            @RequestBody OrientationRuleRequest request
    ) {

        OrientationRule orientationRule =
                new OrientationRule(
                        request.getPriority(),
                        request.getActive(),
                        null,
                        null
                );

        OrientationRule updatedRule =
                orientationRuleService.updateRule(
                        id,
                        orientationRule
                );

        return ResponseEntity.ok(
                toResponse(updatedRule)
        );
    }

    // ============================================================
    // SUPPRIMER UNE RÈGLE
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRule(
            @PathVariable Long id
    ) {

        orientationRuleService.deleteRule(id);

        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // CONVERSION ENTITY → RESPONSE
    // ============================================================

    private static OrientationRuleResponse toResponse(
            OrientationRule orientationRule
    ) {

        Long optionId =
                orientationRule.getOption() != null
                        ? orientationRule.getOption().getId()
                        : null;

        Long resultId =
                orientationRule.getResult() != null
                        ? orientationRule.getResult().getId()
                        : null;

        return new OrientationRuleResponse(
                orientationRule.getId(),
                orientationRule.getPriority(),
                orientationRule.getActive(),
                optionId,
                resultId
        );
    }
}