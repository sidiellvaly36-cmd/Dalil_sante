package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.TypeEtablissement;
import com.Stage.Dalil_sante.repository.TypeEtablissementRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TypeEtablissementService {

    private final TypeEtablissementRepository typeEtablissementRepository;

    public TypeEtablissementService(
            TypeEtablissementRepository typeEtablissementRepository
    ) {
        this.typeEtablissementRepository =
                typeEtablissementRepository;
    }

    // Ajouter un type d'établissement
    public TypeEtablissement createType(
            TypeEtablissement typeEtablissement
    ) {

        if (typeEtablissementRepository
                .existsByNom(typeEtablissement.getNom())) {

            throw new RuntimeException(
                    "Un type d'établissement avec ce nom existe déjà"
            );
        }

        return typeEtablissementRepository.save(
                typeEtablissement
        );
    }

    // Récupérer tous les types
    public List<TypeEtablissement> getAllTypes() {
        return typeEtablissementRepository.findAll();
    }

    // Récupérer uniquement les types actifs
    public List<TypeEtablissement> getActiveTypes() {
        return typeEtablissementRepository.findByActifTrue();
    }

    // Récupérer un type par son ID
    public Optional<TypeEtablissement> getTypeById(Long id) {
        return typeEtablissementRepository.findById(id);
    }

    // Modifier un type
    public TypeEtablissement updateType(
            Long id,
            TypeEtablissement newType
    ) {

        TypeEtablissement existingType =
                typeEtablissementRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Type d'établissement introuvable avec l'ID : "
                                                + id
                                )
                        );

        if (!existingType.getNom().equals(newType.getNom())
                && typeEtablissementRepository
                .existsByNom(newType.getNom())) {

            throw new RuntimeException(
                    "Un type d'établissement avec ce nom existe déjà"
            );
        }

        existingType.setNom(newType.getNom());
        existingType.setDescription(newType.getDescription());
        existingType.setActif(newType.getActif());

        return typeEtablissementRepository.save(existingType);
    }

    // Supprimer un type
    public void deleteType(Long id) {

        if (!typeEtablissementRepository.existsById(id)) {
            throw new RuntimeException(
                    "Type d'établissement introuvable avec l'ID : "
                            + id
            );
        }

        typeEtablissementRepository.deleteById(id);
    }
}
