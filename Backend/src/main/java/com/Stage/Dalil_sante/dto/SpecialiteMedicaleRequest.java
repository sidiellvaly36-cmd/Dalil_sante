package com.Stage.Dalil_sante.dto;

public class SpecialiteMedicaleRequest {

    private String nom;

    private String description;

    private Boolean actif = true;

    public SpecialiteMedicaleRequest() {
    }

    public SpecialiteMedicaleRequest(
            String nom,
            String description,
            Boolean actif
    ) {
        this.nom = nom;
        this.description = description;
        this.actif = actif;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }
}