package com.Stage.Dalil_sante.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "numeros_urgence")
public class NumeroUrgence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String numero;

    private String description;

    // Optionnel : un numéro d'urgence peut être rattaché à un établissement de
    // santé précis (ex. le SAMU d'un hôpital donné), ou rester un numéro
    // général de la plateforme (ex. Protection Civile) - aucune notion de
    // "Médecin" n'existe ni n'est introduite ici.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etablissement_id")
    private EtablissementSante etablissement;

    @ManyToMany(mappedBy = "numerosUrgence")
    private List<Utilisateur> utilisateurs = new ArrayList<>();

    public NumeroUrgence() {
    }

    public NumeroUrgence(
            String nom,
            String numero,
            String description,
            EtablissementSante etablissement
    ) {
        this.nom = nom;
        this.numero = numero;
        this.description = description;
        this.etablissement = etablissement;
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

    public List<Utilisateur> getUtilisateurs() {
        return utilisateurs;
    }

    public void setUtilisateurs(List<Utilisateur> utilisateurs) {
        this.utilisateurs = utilisateurs;
    }

    public EtablissementSante getEtablissement() {
        return etablissement;
    }

    public void setEtablissement(EtablissementSante etablissement) {
        this.etablissement = etablissement;
    }
}