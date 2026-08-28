package com.Stage.Dalil_sante.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Stage.Dalil_sante.entity.RechercheLog;
import com.Stage.Dalil_sante.enums.TypeRecherche;

public interface RechercheLogRepository extends JpaRepository<RechercheLog, Long> {

    long countByDateRechercheBetween(LocalDateTime debut, LocalDateTime fin);

    interface RepartitionTypeProjection {
        TypeRecherche getType();
        Long getNombre();
    }

    @Query("SELECT r.type as type, COUNT(r) as nombre FROM RechercheLog r GROUP BY r.type")
    List<RepartitionTypeProjection> repartitionParType();

    interface RechercheFrequenteProjection {
        String getQuery();
        TypeRecherche getType();
        Long getNombre();
    }

    @Query(
        "SELECT r.query as query, r.type as type, COUNT(r) as nombre " +
        "FROM RechercheLog r GROUP BY r.query, r.type ORDER BY COUNT(r) DESC"
    )
    List<RechercheFrequenteProjection> recherchesFrequentes(Pageable pageable);

    /**
     * Agrégation réelle effectuée par PostgreSQL (date_trunc), pas côté Java :
     * periode = début de chaque jour/mois/année tronqué, nombre = COUNT réel.
     * unit vaut 'day', 'month' ou 'year' (valeurs contrôlées par le Service,
     * jamais fournies telles quelles par le client).
     */
    @Query(
        value = "SELECT date_trunc(:unit, date_recherche) as periode, COUNT(*) as nombre " +
                "FROM recherche_logs WHERE date_recherche >= :depuis " +
                "GROUP BY periode ORDER BY periode ASC",
        nativeQuery = true
    )
    List<Object[]> evolution(@Param("unit") String unit, @Param("depuis") LocalDateTime depuis);
}