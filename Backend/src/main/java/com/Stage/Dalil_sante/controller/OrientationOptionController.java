package com.Stage.Dalil_sante.controller;

import com.Stage.Dalil_sante.entity.OrientationOption;
import com.Stage.Dalil_sante.service.OrientationOptionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orientation/options")
public class OrientationOptionController {

    private final OrientationOptionService orientationOptionService;

    public OrientationOptionController(
            OrientationOptionService orientationOptionService
    ) {
        this.orientationOptionService = orientationOptionService;
    }

    // Ajouter une option à une question
    @PostMapping("/question/{questionId}")
    public ResponseEntity<OrientationOption> createOption(
            @PathVariable Long questionId,
            @RequestBody OrientationOption orientationOption
    ) {

        OrientationOption createdOption =
                orientationOptionService.createOption(
                        questionId,
                        orientationOption
                );

        return ResponseEntity.ok(createdOption);
    }

    // Récupérer toutes les options d'une question
    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<OrientationOption>>
    getOptionsByQuestionId(
            @PathVariable Long questionId
    ) {

        return ResponseEntity.ok(
                orientationOptionService
                        .getOptionsByQuestionId(questionId)
        );
    }

    // Récupérer les options actives d'une question
    @GetMapping("/question/{questionId}/active")
    public ResponseEntity<List<OrientationOption>>
    getActiveOptionsByQuestionId(
            @PathVariable Long questionId
    ) {

        return ResponseEntity.ok(
                orientationOptionService
                        .getActiveOptionsByQuestionId(questionId)
        );
    }

    // Récupérer une option par ID
    @GetMapping("/{id}")
    public ResponseEntity<OrientationOption> getOptionById(
            @PathVariable Long id
    ) {

        return orientationOptionService
                .getOptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Modifier une option
    @PutMapping("/{id}")
    public ResponseEntity<OrientationOption> updateOption(
            @PathVariable Long id,
            @RequestBody OrientationOption orientationOption
    ) {

        OrientationOption updatedOption =
                orientationOptionService.updateOption(
                        id,
                        orientationOption
                );

        return ResponseEntity.ok(updatedOption);
    }

    // Supprimer une option
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOption(
            @PathVariable Long id
    ) {

        orientationOptionService.deleteOption(id);

        return ResponseEntity.noContent().build();
    }
}
