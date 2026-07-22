package com.Stage.Dalil_sante.repository;

import com.Stage.Dalil_sante.entity.TypeEtablissement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TypeEtablissementRepository
        extends JpaRepository<TypeEtablissement, Long> {

    Optional<TypeEtablissement> findByNom(String nom);

    boolean existsByNom(String nom);

    List<TypeEtablissement> findByActifTrue();
}
