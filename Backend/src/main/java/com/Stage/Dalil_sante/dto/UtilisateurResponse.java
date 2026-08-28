package com.Stage.Dalil_sante.dto;

import java.time.LocalDateTime;

public class UtilisateurResponse {

    private Long id;

    private String nom;

    private String prenom;

    private String email;

    private String telephone;

    private Boolean actif;

    private String role;

    private LocalDateTime dateCreation;

    public UtilisateurResponse() {
    }

    public UtilisateurResponse(
            Long id,
            String nom,
            String prenom,
            String email,
            String telephone,
            Boolean actif,
            String role,
            LocalDateTime dateCreation
    ) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.actif = actif;
        this.role = role;
        this.dateCreation = dateCreation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
}