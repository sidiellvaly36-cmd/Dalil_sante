package com.Stage.Dalil_sante.repository;

import com.Stage.Dalil_sante.entity.ConseilSante;
import com.Stage.Dalil_sante.enums.CategorieConseil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConseilSanteRepository
        extends JpaRepository<ConseilSante, Long> {

    List<ConseilSante> findByPublieTrue();

    List<ConseilSante> findByPublieTrueAndCategorie(CategorieConseil categorie);
}