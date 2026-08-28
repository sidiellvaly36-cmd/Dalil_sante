package com.Stage.Dalil_sante.dto;

import java.util.List;

public class EtablissementResponse {

    private Long id;

    private String nom;

    private String telephone;

    private String email;

    private String description;

    private Boolean ouvert24h;

    private Boolean actif;

    private Long typeEtablissementId;

    private String typeEtablissementNom;

    private List<IdNomResponse> specialites;

    private List<IdNomResponse> services;

    public EtablissementResponse() {
    }

    public EtablissementResponse(
            Long id,
            String nom,
            String telephone,
            String email,
            String description,
            Boolean ouvert24h,
            Boolean actif,
            Long typeEtablissementId,
            String typeEtablissementNom,
            List<IdNomResponse> specialites,
            List<IdNomResponse> services
    ) {
        this.id = id;
        this.nom = nom;
        this.telephone = telephone;
        this.email = email;
        this.description = description;
        this.ouvert24h = ouvert24h;
        this.actif = actif;
        this.typeEtablissementId = typeEtablissementId;
        this.typeEtablissementNom = typeEtablissementNom;
        this.specialites = specialites;
        this.services = services;
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

    public Long getTypeEtablissementId() {
        return typeEtablissementId;
    }

    public void setTypeEtablissementId(Long typeEtablissementId) {
        this.typeEtablissementId = typeEtablissementId;
    }

    public String getTypeEtablissementNom() {
        return typeEtablissementNom;
    }

    public void setTypeEtablissementNom(String typeEtablissementNom) {
        this.typeEtablissementNom = typeEtablissementNom;
    }

    public List<IdNomResponse> getSpecialites() {
        return specialites;
    }

    public void setSpecialites(List<IdNomResponse> specialites) {
        this.specialites = specialites;
    }

    public List<IdNomResponse> getServices() {
        return services;
    }

    public void setServices(List<IdNomResponse> services) {
        this.services = services;
    }
}