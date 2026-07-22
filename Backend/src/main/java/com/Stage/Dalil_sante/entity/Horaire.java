package com.Stage.Dalil_sante.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(
        name = "horaires",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "etablissement_id",
                                "jour_semaine"
                        }
                )
        }
)
public class Horaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "jour_semaine",
            nullable = false
    )
    private DayOfWeek jourSemaine;

    @Column(name = "heure_ouverture")
    private LocalTime heureOuverture;

    @Column(name = "heure_fermeture")
    private LocalTime heureFermeture;

    @Column(nullable = false)
    private Boolean ferme = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "etablissement_id",
            nullable = false
    )
    private EtablissementSante etablissement;

    public Horaire() {
    }

    public Horaire(
            DayOfWeek jourSemaine,
            LocalTime heureOuverture,
            LocalTime heureFermeture,
            Boolean ferme,
            EtablissementSante etablissement
    ) {
        this.jourSemaine = jourSemaine;
        this.heureOuverture = heureOuverture;
        this.heureFermeture = heureFermeture;
        this.ferme = ferme;
        this.etablissement = etablissement;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DayOfWeek getJourSemaine() {
        return jourSemaine;
    }

    public void setJourSemaine(
            DayOfWeek jourSemaine
    ) {
        this.jourSemaine = jourSemaine;
    }

    public LocalTime getHeureOuverture() {
        return heureOuverture;
    }

    public void setHeureOuverture(
            LocalTime heureOuverture
    ) {
        this.heureOuverture = heureOuverture;
    }

    public LocalTime getHeureFermeture() {
        return heureFermeture;
    }

    public void setHeureFermeture(
            LocalTime heureFermeture
    ) {
        this.heureFermeture = heureFermeture;
    }

    public Boolean getFerme() {
        return ferme;
    }

    public void setFerme(Boolean ferme) {
        this.ferme = ferme;
    }

    public EtablissementSante getEtablissement() {
        return etablissement;
    }

    public void setEtablissement(
            EtablissementSante etablissement
    ) {
        this.etablissement = etablissement;
    }
}
