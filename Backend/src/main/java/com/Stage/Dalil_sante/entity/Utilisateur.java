package com.Stage.Dalil_sante.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.Stage.Dalil_sante.enums.Role;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "utilisateurs")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String telephone;

    @Column(nullable = false)
    private Boolean actif = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    // ==========================
    // Relations
    // ==========================

    @ManyToMany
    @JoinTable(
            name = "utilisateur_etablissement",
            joinColumns = @JoinColumn(name = "utilisateur_id"),
            inverseJoinColumns = @JoinColumn(name = "etablissement_id")
    )
    private List<EtablissementSante> etablissements = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "utilisateur_specialite",
            joinColumns = @JoinColumn(name = "utilisateur_id"),
            inverseJoinColumns = @JoinColumn(name = "specialite_id")
    )
    private List<SpecialiteMedicale> specialites = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "utilisateur_service",
            joinColumns = @JoinColumn(name = "utilisateur_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<ServiceMedical> services = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "utilisateur_numero_urgence",
            joinColumns = @JoinColumn(name = "utilisateur_id"),
            inverseJoinColumns = @JoinColumn(name = "numero_id")
    )
    private List<NumeroUrgence> numerosUrgence = new ArrayList<>();

    @OneToMany(mappedBy = "utilisateur", cascade = CascadeType.ALL)
    private List<OrientationResult> orientationResults = new ArrayList<>();

    public Utilisateur() {
    }

    public Utilisateur(
            String nom,
            String prenom,
            String email,
            String password,
            String telephone,
            Boolean actif,
            Role role
    ) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.telephone = telephone;
        this.actif = actif;
        this.role = role;
        this.dateCreation = LocalDateTime.now();
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public List<EtablissementSante> getEtablissements() {
        return etablissements;
    }

    public void setEtablissements(List<EtablissementSante> etablissements) {
        this.etablissements = etablissements;
    }

    public List<SpecialiteMedicale> getSpecialites() {
        return specialites;
    }

    public void setSpecialites(List<SpecialiteMedicale> specialites) {
        this.specialites = specialites;
    }

    public List<ServiceMedical> getServices() {
        return services;
    }

    public void setServices(List<ServiceMedical> services) {
        this.services = services;
    }

    public List<NumeroUrgence> getNumerosUrgence() {
        return numerosUrgence;
    }

    public void setNumerosUrgence(List<NumeroUrgence> numerosUrgence) {
        this.numerosUrgence = numerosUrgence;
    }

    public List<OrientationResult> getOrientationResults() {
        return orientationResults;
    }

    public void setOrientationResults(List<OrientationResult> orientationResults) {
        this.orientationResults = orientationResults;
    }
}