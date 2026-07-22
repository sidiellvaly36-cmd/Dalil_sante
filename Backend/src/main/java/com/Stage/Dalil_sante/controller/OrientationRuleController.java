package com.Stage.Dalil_sante.controller;

import com.Stage.Dalil_sante.entity.OrientationRule;
import com.Stage.Dalil_sante.service.OrientationRuleService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orientation/rules")
public class OrientationRuleController {

    private final OrientationRuleService orientationRuleService;

    public OrientationRuleController(
            OrientationRuleService orientationRuleService
    ) {
        this.orientationRuleService = orientationRuleService;
    }

    // Ajouter une règle
    @PostMapping
    public ResponseEntity<OrientationRule> createRule(
            @RequestParam Long optionId,
            @RequestParam Long resultId,
            @RequestBody OrientationRule orientationRule
    ) {

        OrientationRule createdRule =
                orientationRuleService.createRule(
                        optionId,
                        resultId,
                        orientationRule
                );

        return ResponseEntity.ok(createdRule);
    }

    // Récupérer toutes les règles
    @GetMapping
    public ResponseEntity<List<OrientationRule>> getAllRules() {

        return ResponseEntity.ok(
                orientationRuleService.getAllRules()
        );
    }

    // Récupérer une règle par ID
    @GetMapping("/{id}")
    public ResponseEntity<OrientationRule> getRuleById(
            @PathVariable Long id
    ) {

        return orientationRuleService
                .getRuleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Récupérer les règles d'une option
    @GetMapping("/option/{optionId}")
    public ResponseEntity<List<OrientationRule>> getRulesByOptionId(
            @PathVariable Long optionId
    ) {

        return ResponseEntity.ok(
                orientationRuleService.getRulesByOptionId(optionId)
        );
    }

    // Modifier une règle
    @PutMapping("/{id}")
    public ResponseEntity<OrientationRule> updateRule(
            @PathVariable Long id,
            @RequestBody OrientationRule orientationRule
    ) {

        OrientationRule updatedRule =
                orientationRuleService.updateRule(
                        id,
                        orientationRule
                );

        return ResponseEntity.ok(updatedRule);
    }

    // Supprimer une règle
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRule(
            @PathVariable Long id
    ) {

        orientationRuleService.deleteRule(id);

        return ResponseEntity.noContent().build();
    }
}