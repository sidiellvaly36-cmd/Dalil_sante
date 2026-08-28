package com.Stage.Dalil_sante.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class HoraireRequest {

    private DayOfWeek jourSemaine;

    private LocalTime heureOuverture;

    private LocalTime heureFermeture;

    private Boolean ferme = false;

    public HoraireRequest() {
    }

    public HoraireRequest(
            DayOfWeek jourSemaine,
            LocalTime heureOuverture,
            LocalTime heureFermeture,
            Boolean ferme
    ) {
        this.jourSemaine = jourSemaine;
        this.heureOuverture = heureOuverture;
        this.heureFermeture = heureFermeture;
        this.ferme = ferme;
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
}