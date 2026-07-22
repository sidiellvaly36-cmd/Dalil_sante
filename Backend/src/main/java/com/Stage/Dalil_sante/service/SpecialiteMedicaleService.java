package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.SpecialiteMedicale;
import com.Stage.Dalil_sante.repository.SpecialiteMedicaleRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SpecialiteMedicaleService {

    private final SpecialiteMedicaleRepository specialiteMedicaleRepository;

    public SpecialiteMedicaleService(
            SpecialiteMedicaleRepository specialiteMedicaleRepository
    ) {
        this.specialiteMedicaleRepository =
                specialiteMedicaleRepository;
    }

    // Ajouter une spécialité médicale
    public SpecialiteMedicale createSpecialite(
            SpecialiteMedicale specialiteMedicale
    ) {

        if (specialiteMedicaleRepository
                .existsByNom(specialiteMedicale.getNom())) {

            throw new RuntimeException(
                    "Une spécialité médicale avec ce nom existe déjà"
            );
        }

        return specialiteMedicaleRepository.save(
                specialiteMedicale
        );
    }

    // Récupérer toutes les spécialités
    public List<SpecialiteMedicale> getAllSpecialites() {
        return specialiteMedicaleRepository.findAll();
    }

    // Récupérer uniquement les spécialités actives
    public List<SpecialiteMedicale> getActiveSpecialites() {
        return specialiteMedicaleRepository.findByActifTrue();
    }

    // Récupérer une spécialité par son ID
    public Optional<SpecialiteMedicale> getSpecialiteById(Long id) {
        return specialiteMedicaleRepository.findById(id);
    }

    // Modifier une spécialité
    public SpecialiteMedicale updateSpecialite(
            Long id,
            SpecialiteMedicale newSpecialite
    ) {

        SpecialiteMedicale existingSpecialite =
                specialiteMedicaleRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Spécialité médicale introuvable avec l'ID : "
                                                + id
                                )
                        );

        if (!existingSpecialite.getNom().equals(newSpecialite.getNom())
                && specialiteMedicaleRepository
                .existsByNom(newSpecialite.getNom())) {

            throw new RuntimeException(
                    "Une spécialité médicale avec ce nom existe déjà"
            );
        }

        existingSpecialite.setNom(newSpecialite.getNom());
        existingSpecialite.setDescription(newSpecialite.getDescription());
        existingSpecialite.setActif(newSpecialite.getActif());

        return specialiteMedicaleRepository.save(
                existingSpecialite
        );
    }

    // Supprimer une spécialité
    public void deleteSpecialite(Long id) {

        if (!specialiteMedicaleRepository.existsById(id)) {
            throw new RuntimeException(
                    "Spécialité médicale introuvable avec l'ID : "
                            + id
            );
        }

        specialiteMedicaleRepository.deleteById(id);
    }
}
