package com.Stage.Dalil_sante.dto;

public class EtablissementUpdateRequest {

    private String nom;

    private String telephone;

    private String email;

    private String description;

    private Boolean ouvert24h = false;

    private Boolean actif = true;

    public EtablissementUpdateRequest() {
    }

    public EtablissementUpdateRequest(
            String nom,
            String telephone,
            String email,
            String description,
            Boolean ouvert24h,
            Boolean actif
    ) {
        this.nom = nom;
        this.telephone = telephone;
        this.email = email;
        this.description = description;
        this.ouvert24h = ouvert24h;
        this.actif = actif;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getOuvert24h() {
        return ouvert24h;
    }

    public void setOuvert24h(Boolean ouvert24h) {
        this.ouvert24h = ouvert24h;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }
}