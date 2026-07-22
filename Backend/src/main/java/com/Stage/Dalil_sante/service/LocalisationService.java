package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.EtablissementSante;
import com.Stage.Dalil_sante.entity.Localisation;
import com.Stage.Dalil_sante.repository.EtablissementSanteRepository;
import com.Stage.Dalil_sante.repository.LocalisationRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocalisationService {

    private final LocalisationRepository localisationRepository;

    private final EtablissementSanteRepository
            etablissementSanteRepository;

    public LocalisationService(
            LocalisationRepository localisationRepository,
            EtablissementSanteRepository etablissementSanteRepository
    ) {
        this.localisationRepository = localisationRepository;
        this.etablissementSanteRepository =
                etablissementSanteRepository;
    }

    // Ajouter une localisation à un établissement
    public Localisation createLocalisation(
            Long etablissementId,
            Localisation localisation
    ) {

        EtablissementSante etablissement =
                etablissementSanteRepository
                        .findById(etablissementId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Établissement de santé introuvable avec l'ID : "
                                                + etablissementId
                                )
                        );

        if (localisationRepository
                .existsByEtablissementId(etablissementId)) {

            throw new RuntimeException(
                    "Cet établissement possède déjà une localisation"
            );
        }

        localisation.setEtablissement(etablissement);

        return localisationRepository.save(localisation);
    }

    // Récupérer toutes les localisations
    public List<Localisation> getAllLocalisations() {
        return localisationRepository.findAll();
    }

    // Récupérer une localisation par ID
    public Optional<Localisation> getLocalisationById(
            Long id
    ) {
        return localisationRepository.findById(id);
    }

    // Récupérer la localisation d'un établissement
    public Optional<Localisation>
    getLocalisationByEtablissement(
            Long etablissementId
    ) {
        return localisationRepository
                .findByEtablissementId(etablissementId);
    }

    // Rechercher par ville
    public List<Localisation> getLocalisationsByVille(
            String ville
    ) {
        return localisationRepository
                .findByVilleIgnoreCase(ville);
    }

    // Rechercher par quartier
    public List<Localisation> getLocalisationsByQuartier(
            String quartier
    ) {
        return localisationRepository
                .findByQuartierIgnoreCase(quartier);
    }

    // Modifier une localisation
    public Localisation updateLocalisation(
            Long id,
            Localisation newLocalisation
    ) {

        Localisation existingLocalisation =
                localisationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Localisation introuvable avec l'ID : "
                                                + id
                                )
                        );

        existingLocalisation.setAdresse(
                newLocalisation.getAdresse()
        );

        existingLocalisation.setVille(
                newLocalisation.getVille()
        );

        existingLocalisation.setQuartier(
                newLocalisation.getQuartier()
        );

        existingLocalisation.setLatitude(
                newLocalisation.getLatitude()
        );

        existingLocalisation.setLongitude(
                newLocalisation.getLongitude()
        );

        return localisationRepository.save(
                existingLocalisation
        );
    }

    // Supprimer une localisation
    public void deleteLocalisation(Long id) {

        if (!localisationRepository.existsById(id)) {

            throw new RuntimeException(
                    "Localisation introuvable avec l'ID : "
                            + id
            );
        }

        localisationRepository.deleteById(id);
    }
}
