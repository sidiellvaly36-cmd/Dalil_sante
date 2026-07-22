package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.OrientationOption;
import com.Stage.Dalil_sante.entity.OrientationQuestion;
import com.Stage.Dalil_sante.repository.OrientationOptionRepository;
import com.Stage.Dalil_sante.repository.OrientationQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrientationOptionService {

    private final OrientationOptionRepository orientationOptionRepository;

    private final OrientationQuestionRepository orientationQuestionRepository;

    public OrientationOptionService(
            OrientationOptionRepository orientationOptionRepository,
            OrientationQuestionRepository orientationQuestionRepository
    ) {
        this.orientationOptionRepository = orientationOptionRepository;
        this.orientationQuestionRepository = orientationQuestionRepository;
    }

    // Ajouter une option à une question
    public OrientationOption createOption(
            Long questionId,
            OrientationOption orientationOption
    ) {

        OrientationQuestion question =
                orientationQuestionRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Question introuvable avec l'ID : "
                                                + questionId
                                )
                        );

        orientationOption.setQuestion(question);

        return orientationOptionRepository.save(orientationOption);
    }

    // Récupérer toutes les options d'une question
    public List<OrientationOption> getOptionsByQuestionId(
            Long questionId
    ) {
        return orientationOptionRepository
                .findByQuestionIdOrderByOptionOrderAsc(questionId);
    }

    // Récupérer les options actives d'une question
    public List<OrientationOption> getActiveOptionsByQuestionId(
            Long questionId
    ) {
        return orientationOptionRepository
                .findByQuestionIdAndActiveTrueOrderByOptionOrderAsc(
                        questionId
                );
    }

    // Récupérer une option par son ID
    public Optional<OrientationOption> getOptionById(Long id) {
        return orientationOptionRepository.findById(id);
    }

    // Modifier une option
    public OrientationOption updateOption(
            Long id,
            OrientationOption newOption
    ) {

        OrientationOption existingOption =
                orientationOptionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Option introuvable avec l'ID : " + id
                                )
                        );

        existingOption.setOptionText(
                newOption.getOptionText()
        );

        existingOption.setOptionOrder(
                newOption.getOptionOrder()
        );

        existingOption.setActive(
                newOption.getActive()
        );

        return orientationOptionRepository.save(existingOption);
    }

    // Supprimer une option
    public void deleteOption(Long id) {

        if (!orientationOptionRepository.existsById(id)) {
            throw new RuntimeException(
                    "Option introuvable avec l'ID : " + id
            );
        }

        orientationOptionRepository.deleteById(id);
    }
}
