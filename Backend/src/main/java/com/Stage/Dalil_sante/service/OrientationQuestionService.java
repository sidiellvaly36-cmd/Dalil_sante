package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.OrientationQuestion;
import com.Stage.Dalil_sante.repository.OrientationQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrientationQuestionService {

    private final OrientationQuestionRepository orientationQuestionRepository;

    public OrientationQuestionService(
            OrientationQuestionRepository orientationQuestionRepository
    ) {
        this.orientationQuestionRepository = orientationQuestionRepository;
    }

    // Ajouter une nouvelle question
    public OrientationQuestion createQuestion(
            OrientationQuestion orientationQuestion
    ) {
        return orientationQuestionRepository.save(orientationQuestion);
    }

    // Récupérer toutes les questions par ordre
    public List<OrientationQuestion> getAllQuestions() {
        return orientationQuestionRepository
                .findAllByOrderByQuestionOrderAsc();
    }

    // Récupérer uniquement les questions actives
    public List<OrientationQuestion> getActiveQuestions() {
        return orientationQuestionRepository.findByActiveTrue();
    }

    // Récupérer une question par son ID
    public Optional<OrientationQuestion> getQuestionById(Long id) {
        return orientationQuestionRepository.findById(id);
    }

    // Modifier une question
    public OrientationQuestion updateQuestion(
            Long id,
            OrientationQuestion newQuestion
    ) {

        OrientationQuestion existingQuestion =
                orientationQuestionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Question introuvable avec l'ID : " + id
                                )
                        );

        existingQuestion.setQuestionText(
                newQuestion.getQuestionText()
        );

        existingQuestion.setQuestionOrder(
                newQuestion.getQuestionOrder()
        );

        existingQuestion.setActive(
                newQuestion.getActive()
        );

        return orientationQuestionRepository.save(existingQuestion);
    }

    // Supprimer une question
    public void deleteQuestion(Long id) {

        if (!orientationQuestionRepository.existsById(id)) {
            throw new RuntimeException(
                    "Question introuvable avec l'ID : " + id
            );
        }

        orientationQuestionRepository.deleteById(id);
    }
}
