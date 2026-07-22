package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.OrientationResult;
import com.Stage.Dalil_sante.repository.OrientationResultRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrientationResultService {

    private final OrientationResultRepository orientationResultRepository;

    public OrientationResultService(
            OrientationResultRepository orientationResultRepository
    ) {
        this.orientationResultRepository =
                orientationResultRepository;
    }

    // Ajouter un résultat
    public OrientationResult createResult(
            OrientationResult orientationResult
    ) {
        return orientationResultRepository.save(
                orientationResult
        );
    }

    // Récupérer tous les résultats
    public List<OrientationResult> getAllResults() {
        return orientationResultRepository.findAll();
    }

    // Récupérer uniquement les résultats actifs
    public List<OrientationResult> getActiveResults() {
        return orientationResultRepository.findByActiveTrue();
    }

    // Récupérer un résultat par son ID
    public Optional<OrientationResult> getResultById(Long id) {
        return orientationResultRepository.findById(id);
    }

    // Récupérer les résultats selon le niveau d'urgence
    public List<OrientationResult> getResultsByUrgencyLevel(
            String urgencyLevel
    ) {
        return orientationResultRepository
                .findByUrgencyLevel(urgencyLevel);
    }

    // Modifier un résultat
    public OrientationResult updateResult(
            Long id,
            OrientationResult newResult
    ) {

        OrientationResult existingResult =
                orientationResultRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Résultat d'orientation introuvable avec l'ID : "
                                                + id
                                )
                        );

        existingResult.setTitle(
                newResult.getTitle()
        );

        existingResult.setDescription(
                newResult.getDescription()
        );

        existingResult.setUrgencyLevel(
                newResult.getUrgencyLevel()
        );

        existingResult.setRecommendedSpecialty(
                newResult.getRecommendedSpecialty()
        );

        existingResult.setRecommendedEstablishmentType(
                newResult.getRecommendedEstablishmentType()
        );

        existingResult.setActive(
                newResult.getActive()
        );

        return orientationResultRepository.save(
                existingResult
        );
    }

    // Supprimer un résultat
    public void deleteResult(Long id) {

        if (!orientationResultRepository.existsById(id)) {
            throw new RuntimeException(
                    "Résultat d'orientation introuvable avec l'ID : "
                            + id
            );
        }

        orientationResultRepository.deleteById(id);
    }
}
