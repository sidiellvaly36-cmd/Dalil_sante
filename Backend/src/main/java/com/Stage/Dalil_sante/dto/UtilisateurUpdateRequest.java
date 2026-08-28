package com.Stage.Dalil_sante.dto;

public class UtilisateurUpdateRequest {

    private String nom;

    private String prenom;

    private String email;

    private String telephone;

    private Boolean actif = true;

    public UtilisateurUpdateRequest() {
    }

    public UtilisateurUpdateRequest(
            String nom,
            String prenom,
            String email,
            String telephone,
            Boolean actif
    ) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.actif = actif;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }
}