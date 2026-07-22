package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.EtablissementSante;
import com.Stage.Dalil_sante.entity.ServiceMedical;
import com.Stage.Dalil_sante.entity.SpecialiteMedicale;
import com.Stage.Dalil_sante.entity.TypeEtablissement;

import com.Stage.Dalil_sante.repository.EtablissementSanteRepository;
import com.Stage.Dalil_sante.repository.ServiceMedicalRepository;
import com.Stage.Dalil_sante.repository.SpecialiteMedicaleRepository;
import com.Stage.Dalil_sante.repository.TypeEtablissementRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EtablissementSanteService {

    private final EtablissementSanteRepository etablissementRepository;
    private final TypeEtablissementRepository typeRepository;
    private final SpecialiteMedicaleRepository specialiteRepository;
    private final ServiceMedicalRepository serviceRepository;

    public EtablissementSanteService(
            EtablissementSanteRepository etablissementRepository,
            TypeEtablissementRepository typeRepository,
            SpecialiteMedicaleRepository specialiteRepository,
            ServiceMedicalRepository serviceRepository
    ) {
        this.etablissementRepository = etablissementRepository;
        this.typeRepository = typeRepository;
        this.specialiteRepository = specialiteRepository;
        this.serviceRepository = serviceRepository;
    }

    // Créer un établissement
    public EtablissementSante createEtablissement(
            Long typeId,
            EtablissementSante etablissement
    ) {

        TypeEtablissement type =
                typeRepository.findById(typeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Type d'établissement introuvable avec l'ID : "
                                                + typeId
                                )
                        );

        etablissement.setTypeEtablissement(type);

        return etablissementRepository.save(etablissement);
    }

    // Récupérer tous les établissements
    public List<EtablissementSante> getAllEtablissements() {
        return etablissementRepository.findAll();
    }

    // Récupérer les établissements actifs
    public List<EtablissementSante> getActiveEtablissements() {
        return etablissementRepository.findByActifTrue();
    }

    // Récupérer un établissement par ID
    public Optional<EtablissementSante> getEtablissementById(
            Long id
    ) {
        return etablissementRepository.findById(id);
    }

    // Rechercher par nom
    public List<EtablissementSante> searchByNom(String nom) {
        return etablissementRepository
                .findByNomContainingIgnoreCase(nom);
    }

    // Récupérer par type
    public List<EtablissementSante> getByType(Long typeId) {
        return etablissementRepository
                .findByTypeEtablissementId(typeId);
    }

    // Ajouter une spécialité
    public EtablissementSante addSpecialite(
            Long etablissementId,
            Long specialiteId
    ) {

        EtablissementSante etablissement =
                getEtablissementOrThrow(etablissementId);

        SpecialiteMedicale specialite =
                specialiteRepository.findById(specialiteId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Spécialité médicale introuvable avec l'ID : "
                                                + specialiteId
                                )
                        );

        etablissement.getSpecialites().add(specialite);

        return etablissementRepository.save(etablissement);
    }

    // Ajouter un service médical
    public EtablissementSante addService(
            Long etablissementId,
            Long serviceId
    ) {

        EtablissementSante etablissement =
                getEtablissementOrThrow(etablissementId);

        ServiceMedical service =
                serviceRepository.findById(serviceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Service médical introuvable avec l'ID : "
                                                + serviceId
                                )
                        );

        etablissement.getServices().add(service);

        return etablissementRepository.save(etablissement);
    }

    // Modifier un établissement
    public EtablissementSante updateEtablissement(
            Long id,
            EtablissementSante newEtablissement
    ) {

        EtablissementSante existing =
                getEtablissementOrThrow(id);

        existing.setNom(newEtablissement.getNom());
        existing.setTelephone(newEtablissement.getTelephone());
        existing.setEmail(newEtablissement.getEmail());
        existing.setDescription(newEtablissement.getDescription());
        existing.setOuvert24h(newEtablissement.getOuvert24h());
        existing.setActif(newEtablissement.getActif());

        return etablissementRepository.save(existing);
    }

    // Supprimer un établissement
    public void deleteEtablissement(Long id) {

        if (!etablissementRepository.existsById(id)) {
            throw new RuntimeException(
                    "Établissement de santé introuvable avec l'ID : "
                            + id
            );
        }

        etablissementRepository.deleteById(id);
    }

    private EtablissementSante getEtablissementOrThrow(
            Long id
    ) {
        return etablissementRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Établissement de santé introuvable avec l'ID : "
                                        + id
                        )
                );
    }
}
