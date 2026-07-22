package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.ServiceMedical;
import com.Stage.Dalil_sante.repository.ServiceMedicalRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceMedicalService {

    private final ServiceMedicalRepository serviceMedicalRepository;

    public ServiceMedicalService(
            ServiceMedicalRepository serviceMedicalRepository
    ) {
        this.serviceMedicalRepository = serviceMedicalRepository;
    }

    // Ajouter un service médical
    public ServiceMedical createService(
            ServiceMedical serviceMedical
    ) {

        if (serviceMedicalRepository
                .existsByNom(serviceMedical.getNom())) {

            throw new RuntimeException(
                    "Un service médical avec ce nom existe déjà"
            );
        }

        return serviceMedicalRepository.save(serviceMedical);
    }

    // Récupérer tous les services médicaux
    public List<ServiceMedical> getAllServices() {
        return serviceMedicalRepository.findAll();
    }

    // Récupérer uniquement les services actifs
    public List<ServiceMedical> getActiveServices() {
        return serviceMedicalRepository.findByActifTrue();
    }

    // Récupérer un service par son ID
    public Optional<ServiceMedical> getServiceById(Long id) {
        return serviceMedicalRepository.findById(id);
    }

    // Modifier un service médical
    public ServiceMedical updateService(
            Long id,
            ServiceMedical newService
    ) {

        ServiceMedical existingService =
                serviceMedicalRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Service médical introuvable avec l'ID : "
                                                + id
                                )
                        );

        if (!existingService.getNom().equals(newService.getNom())
                && serviceMedicalRepository
                .existsByNom(newService.getNom())) {

            throw new RuntimeException(
                    "Un service médical avec ce nom existe déjà"
            );
        }

        existingService.setNom(newService.getNom());

        existingService.setDescription(
                newService.getDescription()
        );

        existingService.setActif(
                newService.getActif()
        );

        return serviceMedicalRepository.save(existingService);
    }

    // Supprimer un service médical
    public void deleteService(Long id) {

        if (!serviceMedicalRepository.existsById(id)) {

            throw new RuntimeException(
                    "Service médical introuvable avec l'ID : "
                            + id
            );
        }

        serviceMedicalRepository.deleteById(id);
    }
}
