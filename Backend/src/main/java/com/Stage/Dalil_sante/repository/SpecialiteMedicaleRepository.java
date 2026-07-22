package com.Stage.Dalil_sante.repository;

import com.Stage.Dalil_sante.entity.SpecialiteMedicale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SpecialiteMedicaleRepository
        extends JpaRepository<SpecialiteMedicale, Long> {

    Optional<SpecialiteMedicale> findByNom(String nom);

    boolean existsByNom(String nom);

    List<SpecialiteMedicale> findByActifTrue();
}
