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

import com.Stage.Dalil_sante.dto.OrientationQuestionRequest;
import com.Stage.Dalil_sante.dto.OrientationQuestionResponse;
import com.Stage.Dalil_sante.entity.OrientationQuestion;
import com.Stage.Dalil_sante.service.OrientationQuestionService;

import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/api/orientation/questions")
public class OrientationQuestionController {

    private final OrientationQuestionService orientationQuestionService;

    public OrientationQuestionController(
            OrientationQuestionService orientationQuestionService
    ) {
        this.orientationQuestionService = orientationQuestionService;
    }

    // ============================================================
    // AJOUTER UNE NOUVELLE QUESTION
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<OrientationQuestionResponse> createQuestion(
            @RequestBody OrientationQuestionRequest request
    ) {

        OrientationQuestion orientationQuestion =
                new OrientationQuestion(
                        request.getQuestionText(),
                        request.getQuestionOrder(),
                        request.getActive()
                );

        OrientationQuestion createdQuestion =
                orientationQuestionService.createQuestion(
                        orientationQuestion
                );

        return ResponseEntity.ok(
                toResponse(createdQuestion)
        );
    }

    // ============================================================
    // RÉCUPÉRER TOUTES LES QUESTIONS
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping
    public ResponseEntity<List<OrientationQuestionResponse>> getAllQuestions() {

        List<OrientationQuestionResponse> questions =
                orientationQuestionService
                        .getAllQuestions()
                        .stream()
                        .map(OrientationQuestionController::toResponse)
                        .toList();

        return ResponseEntity.ok(questions);
    }

    // ============================================================
    // RÉCUPÉRER UNIQUEMENT LES QUESTIONS ACTIVES
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/active")
    public ResponseEntity<List<OrientationQuestionResponse>> getActiveQuestions() {

        List<OrientationQuestionResponse> questions =
                orientationQuestionService
                        .getActiveQuestions()
                        .stream()
                        .map(OrientationQuestionController::toResponse)
                        .toList();

        return ResponseEntity.ok(questions);
    }

    // ============================================================
    // RÉCUPÉRER UNE QUESTION PAR SON ID
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/{id}")
    public ResponseEntity<OrientationQuestionResponse> getQuestionById(
            @PathVariable Long id
    ) {

        return orientationQuestionService
                .getQuestionById(id)
                .map(OrientationQuestionController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================
    // MODIFIER UNE QUESTION
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<OrientationQuestionResponse> updateQuestion(
            @PathVariable Long id,
            @RequestBody OrientationQuestionRequest request
    ) {

        OrientationQuestion orientationQuestion =
                new OrientationQuestion(
                        request.getQuestionText(),
                        request.getQuestionOrder(),
                        request.getActive()
                );

        OrientationQuestion updatedQuestion =
                orientationQuestionService.updateQuestion(
                        id,
                        orientationQuestion
                );

        return ResponseEntity.ok(
                toResponse(updatedQuestion)
        );
    }

    // ============================================================
    // SUPPRIMER UNE QUESTION
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long id
    ) {

        orientationQuestionService.deleteQuestion(id);

        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // CONVERSION ENTITY → RESPONSE
    // ============================================================

    private static OrientationQuestionResponse toResponse(
            OrientationQuestion orientationQuestion
    ) {

        return new OrientationQuestionResponse(
                orientationQuestion.getId(),
                orientationQuestion.getQuestionText(),
                orientationQuestion.getQuestionOrder(),
                orientationQuestion.getActive()
        );
    }
}