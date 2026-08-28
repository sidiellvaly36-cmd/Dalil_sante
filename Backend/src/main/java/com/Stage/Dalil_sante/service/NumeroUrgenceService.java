package com.Stage.Dalil_sante.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.Stage.Dalil_sante.entity.EtablissementSante;
import com.Stage.Dalil_sante.entity.NumeroUrgence;
import com.Stage.Dalil_sante.repository.EtablissementSanteRepository;
import com.Stage.Dalil_sante.repository.NumeroUrgenceRepository;

@Service
public class NumeroUrgenceService {

    private final NumeroUrgenceRepository numeroUrgenceRepository;
    private final EtablissementSanteRepository etablissementSanteRepository;

    public NumeroUrgenceService(
            NumeroUrgenceRepository numeroUrgenceRepository,
            EtablissementSanteRepository etablissementSanteRepository
    ) {
        this.numeroUrgenceRepository = numeroUrgenceRepository;
        this.etablissementSanteRepository = etablissementSanteRepository;
    }

    // Ajouter un numéro d'urgence (etablissementId optionnel)
    public NumeroUrgence createNumeroUrgence(
            Long etablissementId,
            NumeroUrgence numeroUrgence
    ) {

        if (etablissementId != null) {
            numeroUrgence.setEtablissement(
                    getEtablissementOrThrow(etablissementId)
            );
        }

        return numeroUrgenceRepository.save(numeroUrgence);
    }

    public List<NumeroUrgence> getAllNumerosUrgence() {
        return numeroUrgenceRepository.findAll();
    }

    public Optional<NumeroUrgence> getNumeroUrgenceById(Long id) {
        return numeroUrgenceRepository.findById(id);
    }

    // Modifier un numéro d'urgence (etablissementId optionnel - null = dissocier)
    public NumeroUrgence updateNumeroUrgence(
            Long id,
            Long etablissementId,
            NumeroUrgence numeroUrgence
    ) {

        NumeroUrgence existing = numeroUrgenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Numéro d'urgence introuvable"));

        existing.setNom(numeroUrgence.getNom());
        existing.setNumero(numeroUrgence.getNumero());
        existing.setDescription(numeroUrgence.getDescription());

        if (etablissementId != null) {
            existing.setEtablissement(
                    getEtablissementOrThrow(etablissementId)
            );
        } else {
            existing.setEtablissement(null);
        }

        return numeroUrgenceRepository.save(existing);
    }

    public void deleteNumeroUrgence(Long id) {
        numeroUrgenceRepository.deleteById(id);
    }

    private EtablissementSante getEtablissementOrThrow(Long id) {
        return etablissementSanteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Établissement de santé introuvable avec l'ID : " + id
                        )
                );
    }
}