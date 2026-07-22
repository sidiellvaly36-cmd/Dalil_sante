package com.Stage.Dalil_sante.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "localisations")
public class Localisation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String adresse;

    private String ville;

    private String quartier;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "etablissement_id",
            nullable = false,
            unique = true
    )
    private EtablissementSante etablissement;

    public Localisation() {
    }

    public Localisation(
            String adresse,
            String ville,
            String quartier,
            Double latitude,
            Double longitude,
            EtablissementSante etablissement
    ) {
        this.adresse = adresse;
        this.ville = ville;
        this.quartier = quartier;
        this.latitude = latitude;
        this.longitude = longitude;
        this.etablissement = etablissement;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getQuartier() {
        return quartier;
    }

    public void setQuartier(String quartier) {
        this.quartier = quartier;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public EtablissementSante getEtablissement() {
        return etablissement;
    }

    public void setEtablissement(
            EtablissementSante etablissement
    ) {
        this.etablissement = etablissement;
    }
}