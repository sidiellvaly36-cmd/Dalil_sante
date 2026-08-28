package com.Stage.Dalil_sante.dto;

import java.util.List;

/** Réponse complète de GET /api/statistiques/recherches - tout est agrégé côté PostgreSQL. */
public class StatistiqueRechercheResponse {

    private long totalRecherches;
    private long recherchesAujourdHui;
    private long recherchesCeMois;
    private long recherchesCetteAnnee;

    private List<RepartitionTypeItem> repartitionParType;
    private List<RechercheFrequenteItem> recherchesFrequentes;

    private List<EvolutionPointItem> evolutionParJour;
    private List<EvolutionPointItem> evolutionParMois;
    private List<EvolutionPointItem> evolutionParAnnee;

    public StatistiqueRechercheResponse() {
    }

    public StatistiqueRechercheResponse(
            long totalRecherches,
            long recherchesAujourdHui,
            long recherchesCeMois,
            long recherchesCetteAnnee,
            List<RepartitionTypeItem> repartitionParType,
            List<RechercheFrequenteItem> recherchesFrequentes,
            List<EvolutionPointItem> evolutionParJour,
            List<EvolutionPointItem> evolutionParMois,
            List<EvolutionPointItem> evolutionParAnnee
    ) {
        this.totalRecherches = totalRecherches;
        this.recherchesAujourdHui = recherchesAujourdHui;
        this.recherchesCeMois = recherchesCeMois;
        this.recherchesCetteAnnee = recherchesCetteAnnee;
        this.repartitionParType = repartitionParType;
        this.recherchesFrequentes = recherchesFrequentes;
        this.evolutionParJour = evolutionParJour;
        this.evolutionParMois = evolutionParMois;
        this.evolutionParAnnee = evolutionParAnnee;
    }

    public long getTotalRecherches() {
        return totalRecherches;
    }

    public void setTotalRecherches(long totalRecherches) {
        this.totalRecherches = totalRecherches;
    }

    public long getRecherchesAujourdHui() {
        return recherchesAujourdHui;
    }

    public void setRecherchesAujourdHui(long recherchesAujourdHui) {
        this.recherchesAujourdHui = recherchesAujourdHui;
    }

    public long getRecherchesCeMois() {
        return recherchesCeMois;
    }

    public void setRecherchesCeMois(long recherchesCeMois) {
        this.recherchesCeMois = recherchesCeMois;
    }

    public long getRecherchesCetteAnnee() {
        return recherchesCetteAnnee;
    }

    public void setRecherchesCetteAnnee(long recherchesCetteAnnee) {
        this.recherchesCetteAnnee = recherchesCetteAnnee;
    }

    public List<RepartitionTypeItem> getRepartitionParType() {
        return repartitionParType;
    }

    public void setRepartitionParType(List<RepartitionTypeItem> repartitionParType) {
        this.repartitionParType = repartitionParType;
    }

    public List<RechercheFrequenteItem> getRecherchesFrequentes() {
        return recherchesFrequentes;
    }

    public void setRecherchesFrequentes(List<RechercheFrequenteItem> recherchesFrequentes) {
        this.recherchesFrequentes = recherchesFrequentes;
    }

    public List<EvolutionPointItem> getEvolutionParJour() {
        return evolutionParJour;
    }

    public void setEvolutionParJour(List<EvolutionPointItem> evolutionParJour) {
        this.evolutionParJour = evolutionParJour;
    }

    public List<EvolutionPointItem> getEvolutionParMois() {
        return evolutionParMois;
    }

    public void setEvolutionParMois(List<EvolutionPointItem> evolutionParMois) {
        this.evolutionParMois = evolutionParMois;
    }

    public List<EvolutionPointItem> getEvolutionParAnnee() {
        return evolutionParAnnee;
    }

    public void setEvolutionParAnnee(List<EvolutionPointItem> evolutionParAnnee) {
        this.evolutionParAnnee = evolutionParAnnee;
    }
}