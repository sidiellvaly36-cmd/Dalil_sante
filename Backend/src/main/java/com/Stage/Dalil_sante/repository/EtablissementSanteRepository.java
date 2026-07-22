package com.Stage.Dalil_sante.repository;

import com.Stage.Dalil_sante.entity.EtablissementSante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EtablissementSanteRepository
        extends JpaRepository<EtablissementSante, Long> {

    List<EtablissementSante> findByActifTrue();

    List<EtablissementSante>
    findByTypeEtablissementId(Long typeId);

    List<EtablissementSante>
    findBySpecialitesId(Long specialiteId);

    List<EtablissementSante>
    findByServicesId(Long serviceId);

    List<EtablissementSante>
    findByNomContainingIgnoreCase(String nom);
}
