package com.Stage.Dalil_sante.dto;

public class NumeroUrgenceRequest {

    private String nom;

    private String numero;

    private String description;

    private Long etablissementId;

    public NumeroUrgenceRequest() {
    }

    public NumeroUrgenceRequest(
            String nom,
            String numero,
            String description,
            Long etablissementId
    ) {
        this.nom = nom;
        this.numero = numero;
        this.description = description;
        this.etablissementId = etablissementId;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getEtablissementId() {
        return etablissementId;
    }

    public void setEtablissementId(Long etablissementId) {
        this.etablissementId = etablissementId;
    }
}