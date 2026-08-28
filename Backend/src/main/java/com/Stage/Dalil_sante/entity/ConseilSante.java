package com.Stage.Dalil_sante.entity;

import java.time.LocalDateTime;

import com.Stage.Dalil_sante.enums.CategorieConseil;

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

@Entity
@Table(name = "conseils_sante")
public class ConseilSante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    // Rendu nullable : les nouveaux conseils sont désormais basés sur un PDF
    // uploadé (voir pdfPath) et ne saisissent plus de texte libre. Les
    // anciens conseils qui ont déjà un contenu texte le conservent tel quel.
    @Column(columnDefinition = "TEXT")
    private String contenu;

    @Enumerated(EnumType.STRING)
    private CategorieConseil categorie;

    @Column(nullable = false)
    private Boolean publie = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    // Nom de fichier stocké sur disque (ex. UUID.pdf) - jamais le chemin
    // absolu. Nullable pour les anciens conseils créés avant cette fonctionnalité.
    private String pdfPath;

    // Nom de fichier original tel qu'envoyé par l'ADMIN, pour affichage/téléchargement.
    private String pdfFileName;

    // Optionnel : un conseil peut être publié par un établissement de santé précis,
    // ou rester un conseil général de la plateforme.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etablissement_id")
    private EtablissementSante etablissement;

    public ConseilSante() {
    }

    public ConseilSante(
            String titre,
            String contenu,
            CategorieConseil categorie,
            Boolean publie,
            EtablissementSante etablissement
    ) {
        this.titre = titre;
        this.contenu = contenu;
        this.categorie = categorie;
        this.publie = publie;
        this.etablissement = etablissement;
        this.dateCreation = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public CategorieConseil getCategorie() {
        return categorie;
    }

    public void setCategorie(CategorieConseil categorie) {
        this.categorie = categorie;
    }

    public Boolean getPublie() {
        return publie;
    }

    public void setPublie(Boolean publie) {
        this.publie = publie;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public EtablissementSante getEtablissement() {
        return etablissement;
    }

    public void setEtablissement(EtablissementSante etablissement) {
        this.etablissement = etablissement;
    }

    public String getPdfPath() {
        return pdfPath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }

    public String getPdfFileName() {
        return pdfFileName;
    }

    public void setPdfFileName(String pdfFileName) {
        this.pdfFileName = pdfFileName;
    }
}