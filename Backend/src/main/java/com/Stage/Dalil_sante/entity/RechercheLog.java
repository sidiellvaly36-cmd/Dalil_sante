package com.Stage.Dalil_sante.entity;

import java.time.LocalDateTime;

import com.Stage.Dalil_sante.enums.TypeRecherche;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Enregistrement d'une recherche réelle exécutée par un UTILISATEUR (jamais
 * une frappe clavier isolée - un seul enregistrement par recherche
 * effectivement exécutée : soumission du champ nom, ou sélection d'un filtre
 * spécialité/service/type). utilisateur est nullable par prudence de schéma,
 * mais en pratique toujours renseigné puisque /recherche est une route
 * protégée par authentification.
 */
@Entity
@Table(name = "recherche_logs")
public class RechercheLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeRecherche type;

    @Column(nullable = false)
    private String query;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateRecherche;

    public RechercheLog() {
    }

    public RechercheLog(TypeRecherche type, String query, Utilisateur utilisateur) {
        this.type = type;
        this.query = query;
        this.utilisateur = utilisateur;
        this.dateRecherche = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TypeRecherche getType() {
        return type;
    }

    public void setType(TypeRecherche type) {
        this.type = type;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public LocalDateTime getDateRecherche() {
        return dateRecherche;
    }

    public void setDateRecherche(LocalDateTime dateRecherche) {
        this.dateRecherche = dateRecherche;
    }
}