package com.Stage.Dalil_sante.repository;

import com.Stage.Dalil_sante.entity.Horaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface HoraireRepository
        extends JpaRepository<Horaire, Long> {

    List<Horaire> findByEtablissementId(
            Long etablissementId
    );

    Optional<Horaire>
    findByEtablissementIdAndJourSemaine(
            Long etablissementId,
            DayOfWeek jourSemaine
    );

    boolean existsByEtablissementIdAndJourSemaine(
            Long etablissementId,
            DayOfWeek jourSemaine
    );
}
