package com.Stage.Dalil_sante.dto;

public class LocalisationResponse {

    private Long id;

    private String adresse;

    private String ville;

    private String quartier;

    private Double latitude;

    private Double longitude;

    private Long etablissementId;

    public LocalisationResponse() {
    }

    public LocalisationResponse(
            Long id,
            String adresse,
            String ville,
            String quartier,
            Double latitude,
            Double longitude,
            Long etablissementId
    ) {
        this.id = id;
        this.adresse = adresse;
        this.ville = ville;
        this.quartier = quartier;
        this.latitude = latitude;
        this.longitude = longitude;
        this.etablissementId = etablissementId;
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

    public Long getEtablissementId() {
        return etablissementId;
    }

    public void setEtablissementId(Long etablissementId) {
        this.etablissementId = etablissementId;
    }
}