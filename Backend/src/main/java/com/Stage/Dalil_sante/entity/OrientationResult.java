package com.Stage.Dalil_sante.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "orientation_results")
public class OrientationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String urgencyLevel;

    private String recommendedSpecialty;

    private String recommendedEstablishmentType;

    private Boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    public OrientationResult() {
    }

    public OrientationResult(
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
}