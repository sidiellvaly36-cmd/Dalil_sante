package com.Stage.Dalil_sante.dto;

public class NumeroUrgenceResponse {

    private Long id;

    private String nom;

    private String numero;

    private String description;

    private Long etablissementId;

    private String etablissementNom;

    public NumeroUrgenceResponse() {
    }

    public NumeroUrgenceResponse(
            Long id,
            String nom,
            String numero,
            String description,
            Long etablissementId,
            String etablissementNom
    ) {
        this.id = id;
        this.nom = nom;
        this.numero = numero;
        this.description = description;
        this.etablissementId = etablissementId;
        this.etablissementNom = etablissementNom;
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

    public String getEtablissementNom() {
        return etablissementNom;
    }

    public void setEtablissementNom(String etablissementNom) {
        this.etablissementNom = etablissementNom;
    }
}