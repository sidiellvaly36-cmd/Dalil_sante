package com.Stage.Dalil_sante.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "etablissements_sante")
public class EtablissementSante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String telephone;

    private String email;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Boolean ouvert24h = false;

    @Column(nullable = false)
    private Boolean actif = true;

    // Plusieurs établissements peuvent avoir le même type
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_etablissement_id", nullable = false)
    private TypeEtablissement typeEtablissement;

    // Un établissement peut avoir plusieurs spécialités
    @ManyToMany
    @JoinTable(
            name = "etablissement_specialites",
            joinColumns = @JoinColumn(name = "etablissement_id"),
            inverseJoinColumns = @JoinColumn(name = "specialite_id")
    )
    private Set<SpecialiteMedicale> specialites = new HashSet<>();

    // Un établissement peut proposer plusieurs services médicaux
    @ManyToMany
    @JoinTable(
            name = "etablissement_services",
            joinColumns = @JoinColumn(name = "etablissement_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private Set<ServiceMedical> services = new HashSet<>();

    public EtablissementSante() {
    }

    public EtablissementSante(
            String nom,
            String telephone,
            String email,
            String description,
            Boolean ouvert24h,
            Boolean actif,
            TypeEtablissement typeEtablissement
    ) {
        this.nom = nom;
        this.telephone = telephone;
        this.email = email;
        this.description = description;
        this.ouvert24h = ouvert24h;
        this.actif = actif;
        this.typeEtablissement = typeEtablissement;
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

    public TypeEtablissement getTypeEtablissement() {
        return typeEtablissement;
    }

    public void setTypeEtablissement(
            TypeEtablissement typeEtablissement
    ) {
        this.typeEtablissement = typeEtablissement;
    }

    public Set<SpecialiteMedicale> getSpecialites() {
        return specialites;
    }

    public void setSpecialites(
            Set<SpecialiteMedicale> specialites
    ) {
        this.specialites = specialites;
    }

    public Set<ServiceMedical> getServices() {
        return services;
    }

    public void setServices(
            Set<ServiceMedical> services
    ) {
        this.services = services;
    }
}
