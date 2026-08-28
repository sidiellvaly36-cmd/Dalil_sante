package com.Stage.Dalil_sante.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class HoraireResponse {

    private Long id;

    private DayOfWeek jourSemaine;

    private LocalTime heureOuverture;

    private LocalTime heureFermeture;

    private Boolean ferme;

    private Long etablissementId;

    public HoraireResponse() {
    }

    public HoraireResponse(
            Long id,
            DayOfWeek jourSemaine,
            LocalTime heureOuverture,
            LocalTime heureFermeture,
            Boolean ferme,
            Long etablissementId
    ) {
        this.id = id;
        this.jourSemaine = jourSemaine;
        this.heureOuverture = heureOuverture;
        this.heureFermeture = heureFermeture;
        this.ferme = ferme;
        this.etablissementId = etablissementId;
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

    public void setJourSemaine(DayOfWeek jourSemaine) {
        this.jourSemaine = jourSemaine;
    }

    public LocalTime getHeureOuverture() {
        return heureOuverture;
    }

    public void setHeureOuverture(LocalTime heureOuverture) {
        this.heureOuverture = heureOuverture;
    }

    public LocalTime getHeureFermeture() {
        return heureFermeture;
    }

    public void setHeureFermeture(LocalTime heureFermeture) {
        this.heureFermeture = heureFermeture;
    }

    public Boolean getFerme() {
        return ferme;
    }

    public void setFerme(Boolean ferme) {
        this.ferme = ferme;
    }

    public Long getEtablissementId() {
        return etablissementId;
    }

    public void setEtablissementId(Long etablissementId) {
        this.etablissementId = etablissementId;
    }
}