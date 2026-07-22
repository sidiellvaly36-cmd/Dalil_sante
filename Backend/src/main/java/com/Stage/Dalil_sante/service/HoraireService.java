package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.EtablissementSante;
import com.Stage.Dalil_sante.entity.Horaire;
import com.Stage.Dalil_sante.repository.EtablissementSanteRepository;
import com.Stage.Dalil_sante.repository.HoraireRepository;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Service
public class HoraireService {

    private final HoraireRepository horaireRepository;

    private final EtablissementSanteRepository
            etablissementSanteRepository;

    public HoraireService(
            HoraireRepository horaireRepository,
            EtablissementSanteRepository etablissementSanteRepository
    ) {
        this.horaireRepository = horaireRepository;
        this.etablissementSanteRepository =
                etablissementSanteRepository;
    }

    // Ajouter un horaire à un établissement
    public Horaire createHoraire(
            Long etablissementId,
            Horaire horaire
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

        if (horaireRepository
                .existsByEtablissementIdAndJourSemaine(
                        etablissementId,
                        horaire.getJourSemaine()
                )) {

            throw new RuntimeException(
                    "Un horaire existe déjà pour ce jour"
            );
        }

        // Si l'établissement est ouvert 24h/24,
        // il n'est pas nécessaire d'ajouter un horaire
        if (Boolean.TRUE.equals(
                etablissement.getOuvert24h()
        )) {

            throw new RuntimeException(
                    "Cet établissement est déclaré ouvert 24h/24"
            );
        }

        // Si le jour est fermé, les heures sont mises à null
        if (Boolean.TRUE.equals(horaire.getFerme())) {

            horaire.setHeureOuverture(null);
            horaire.setHeureFermeture(null);

        } else {

            if (horaire.getHeureOuverture() == null
                    || horaire.getHeureFermeture() == null) {

                throw new RuntimeException(
                        "Les heures d'ouverture et de fermeture sont obligatoires"
                );
            }
        }

        horaire.setEtablissement(etablissement);

        return horaireRepository.save(horaire);
    }

    // Récupérer tous les horaires
    public List<Horaire> getAllHoraires() {
        return horaireRepository.findAll();
    }

    // Récupérer un horaire par ID
    public Optional<Horaire> getHoraireById(
            Long id
    ) {
        return horaireRepository.findById(id);
    }

    // Récupérer les horaires d'un établissement
    public List<Horaire>
    getHorairesByEtablissement(
            Long etablissementId
    ) {

        return horaireRepository
                .findByEtablissementId(
                        etablissementId
                );
    }

    // Récupérer l'horaire d'un jour précis
    public Optional<Horaire> getHoraireByJour(
            Long etablissementId,
            DayOfWeek jourSemaine
    ) {

        return horaireRepository
                .findByEtablissementIdAndJourSemaine(
                        etablissementId,
                        jourSemaine
                );
    }

    // Modifier un horaire
    public Horaire updateHoraire(
            Long id,
            Horaire newHoraire
    ) {

        Horaire existingHoraire =
                horaireRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Horaire introuvable avec l'ID : "
                                                + id
                                )
                        );

        existingHoraire.setJourSemaine(
                newHoraire.getJourSemaine()
        );

        existingHoraire.setFerme(
                newHoraire.getFerme()
        );

        if (Boolean.TRUE.equals(
                newHoraire.getFerme()
        )) {

            existingHoraire.setHeureOuverture(null);
            existingHoraire.setHeureFermeture(null);

        } else {

            if (newHoraire.getHeureOuverture() == null
                    || newHoraire.getHeureFermeture() == null) {

                throw new RuntimeException(
                        "Les heures d'ouverture et de fermeture sont obligatoires"
                );
            }

            existingHoraire.setHeureOuverture(
                    newHoraire.getHeureOuverture()
            );

            existingHoraire.setHeureFermeture(
                    newHoraire.getHeureFermeture()
            );
        }

        return horaireRepository.save(
                existingHoraire
        );
    }

    // Supprimer un horaire
    public void deleteHoraire(Long id) {

        if (!horaireRepository.existsById(id)) {

            throw new RuntimeException(
                    "Horaire introuvable avec l'ID : "
                            + id
            );
        }

        horaireRepository.deleteById(id);
    }
}
