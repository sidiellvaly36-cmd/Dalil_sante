package com.Stage.Dalil_sante.dto;

public class OrientationResultRequest {

    private String title;

    private String description;

    private String urgencyLevel;

    private String recommendedSpecialty;

    private String recommendedEstablishmentType;

    private Boolean active;

    public OrientationResultRequest() {
    }

    public OrientationResultRequest(
            String title,
            String description,
            String urgencyLevel,
            String recommendedSpecialty,
            String recommendedEstablishmentType,
            Boolean active
    ) {
        this.title = title;
        this.description = description;
        this.urgencyLevel = urgencyLevel;
        this.recommendedSpecialty = recommendedSpecialty;
        this.recommendedEstablishmentType = recommendedEstablishmentType;
        this.active = active;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrgencyLevel() {
        return urgencyLevel;
    }

    public void setUrgencyLevel(String urgencyLevel) {
        this.urgencyLevel = urgencyLevel;
    }

    public String getRecommendedSpecialty() {
        return recommendedSpecialty;
    }

    public void setRecommendedSpecialty(String recommendedSpecialty) {
        this.recommendedSpecialty = recommendedSpecialty;
    }

    public String getRecommendedEstablishmentType() {
        return recommendedEstablishmentType;
    }

    public void setRecommendedEstablishmentType(String recommendedEstablishmentType) {
        this.recommendedEstablishmentType = recommendedEstablishmentType;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}