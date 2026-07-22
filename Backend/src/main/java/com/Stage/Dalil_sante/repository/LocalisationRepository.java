package com.Stage.Dalil_sante.repository;

import com.Stage.Dalil_sante.entity.Localisation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocalisationRepository
        extends JpaRepository<Localisation, Long> {

    Optional<Localisation>
    findByEtablissementId(Long etablissementId);

    boolean existsByEtablissementId(Long etablissementId);

    List<Localisation>
    findByVilleIgnoreCase(String ville);

    List<Localisation>
    findByQuartierIgnoreCase(String quartier);
}
