package com.Stage.Dalil_sante.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.Stage.Dalil_sante.entity.NumeroUrgence;
import com.Stage.Dalil_sante.repository.NumeroUrgenceRepository;

@Service
public class NumeroUrgenceService {

    private final NumeroUrgenceRepository numeroUrgenceRepository;

    public NumeroUrgenceService(NumeroUrgenceRepository numeroUrgenceRepository) {
        this.numeroUrgenceRepository = numeroUrgenceRepository;
    }

    public NumeroUrgence createNumeroUrgence(NumeroUrgence numeroUrgence) {
        return numeroUrgenceRepository.save(numeroUrgence);
    }

    public List<NumeroUrgence> getAllNumerosUrgence() {
        return numeroUrgenceRepository.findAll();
    }

    public Optional<NumeroUrgence> getNumeroUrgenceById(Long id) {
        return numeroUrgenceRepository.findById(id);
    }

    public NumeroUrgence updateNumeroUrgence(Long id, NumeroUrgence numeroUrgence) {

        NumeroUrgence existing = numeroUrgenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Numéro d'urgence introuvable"));

        existing.setNom(numeroUrgence.getNom());
        existing.setNumero(numeroUrgence.getNumero());
        existing.setDescription(numeroUrgence.getDescription());

        return numeroUrgenceRepository.save(existing);
    }

    public void deleteNumeroUrgence(Long id) {
        numeroUrgenceRepository.deleteById(id);
    }
}