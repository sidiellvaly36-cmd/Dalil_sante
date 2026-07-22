package com.Stage.Dalil_sante.controller;

import com.Stage.Dalil_sante.entity.OrientationQuestion;
import com.Stage.Dalil_sante.service.OrientationQuestionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orientation/questions")
@CrossOrigin(origins = "*")
public class OrientationQuestionController {

    private final OrientationQuestionService orientationQuestionService;

    public OrientationQuestionController(
            OrientationQuestionService orientationQuestionService
    ) {
        this.orientationQuestionService = orientationQuestionService;
    }

    // Ajouter une nouvelle question
    @PostMapping
    public ResponseEntity<OrientationQuestion> createQuestion(
            @RequestBody OrientationQuestion orientationQuestion
    ) {
        OrientationQuestion createdQuestion =
                orientationQuestionService.createQuestion(orientationQuestion);

        return ResponseEntity.ok(createdQuestion);
    }

    // Récupérer toutes les questions
    @GetMapping
    public ResponseEntity<List<OrientationQuestion>> getAllQuestions() {

        List<OrientationQuestion> questions =
                orientationQuestionService.getAllQuestions();

        return ResponseEntity.ok(questions);
    }

    // Récupérer uniquement les questions actives
    @GetMapping("/active")
    public ResponseEntity<List<OrientationQuestion>> getActiveQuestions() {

        List<OrientationQuestion> questions =
                orientationQuestionService.getActiveQuestions();

        return ResponseEntity.ok(questions);
    }

    // Récupérer une question par son ID
    @GetMapping("/{id}")
    public ResponseEntity<OrientationQuestion> getQuestionById(
            @PathVariable Long id
    ) {
        return orientationQuestionService
                .getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Modifier une question
    @PutMapping("/{id}")
    public ResponseEntity<OrientationQuestion> updateQuestion(
            @PathVariable Long id,
            @RequestBody OrientationQuestion orientationQuestion
    ) {
        OrientationQuestion updatedQuestion =
                orientationQuestionService.updateQuestion(
                        id,
                        orientationQuestion
                );

        return ResponseEntity.ok(updatedQuestion);
    }

    // Supprimer une question
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long id
    ) {
        orientationQuestionService.deleteQuestion(id);

        return ResponseEntity.noContent().build();
    }
}