package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.OrientationOption;
import com.Stage.Dalil_sante.entity.OrientationResult;
import com.Stage.Dalil_sante.entity.OrientationRule;
import com.Stage.Dalil_sante.repository.OrientationOptionRepository;
import com.Stage.Dalil_sante.repository.OrientationResultRepository;
import com.Stage.Dalil_sante.repository.OrientationRuleRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrientationRuleService {

    private final OrientationRuleRepository orientationRuleRepository;
    private final OrientationOptionRepository orientationOptionRepository;
    private final OrientationResultRepository orientationResultRepository;

    public OrientationRuleService(
            OrientationRuleRepository orientationRuleRepository,
            OrientationOptionRepository orientationOptionRepository,
            OrientationResultRepository orientationResultRepository
    ) {
        this.orientationRuleRepository = orientationRuleRepository;
        this.orientationOptionRepository = orientationOptionRepository;
        this.orientationResultRepository = orientationResultRepository;
    }

    // Ajouter une règle
    public OrientationRule createRule(
            Long optionId,
            Long resultId,
            OrientationRule orientationRule
    ) {

        OrientationOption option =
                orientationOptionRepository.findById(optionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Option introuvable avec l'ID : "
                                                + optionId
                                )
                        );

        OrientationResult result =
                orientationResultRepository.findById(resultId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Résultat introuvable avec l'ID : "
                                                + resultId
                                )
                        );

        orientationRule.setOption(option);
        orientationRule.setResult(result);

        return orientationRuleRepository.save(orientationRule);
    }

    // Récupérer toutes les règles
    public List<OrientationRule> getAllRules() {
        return orientationRuleRepository.findAll();
    }

    // Récupérer une règle par ID
    public Optional<OrientationRule> getRuleById(Long id) {
        return orientationRuleRepository.findById(id);
    }

    // Récupérer les règles d'une option
    public List<OrientationRule> getRulesByOptionId(Long optionId) {
        return orientationRuleRepository.findByOptionId(optionId);
    }

    // Modifier une règle
    public OrientationRule updateRule(
            Long id,
            OrientationRule newRule
    ) {

        OrientationRule existingRule =
                orientationRuleRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Règle introuvable avec l'ID : " + id
                                )
                        );

        existingRule.setPriority(newRule.getPriority());
        existingRule.setActive(newRule.getActive());

        return orientationRuleRepository.save(existingRule);
    }

    // Supprimer une règle
    public void deleteRule(Long id) {

        if (!orientationRuleRepository.existsById(id)) {
            throw new RuntimeException(
                    "Règle introuvable avec l'ID : " + id
            );
        }

        orientationRuleRepository.deleteById(id);
    }
}