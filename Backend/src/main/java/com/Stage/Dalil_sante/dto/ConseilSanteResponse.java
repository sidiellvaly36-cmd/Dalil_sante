package com.Stage.Dalil_sante.dto;

import java.time.LocalDateTime;

import com.Stage.Dalil_sante.enums.CategorieConseil;

public class ConseilSanteResponse {

    private Long id;

    private String titre;

    private String contenu;

    private CategorieConseil categorie;

    private Boolean publie;

    private LocalDateTime dateCreation;

    private Long etablissementId;

    private String etablissementNom;

    // URL relative de l'API pour récupérer le PDF (GET .../pdf), calculée -
    // jamais le chemin disque réel. Null si ce conseil n'a pas (encore) de PDF.
    private String pdfUrl;

    private String pdfFileName;

    public ConseilSanteResponse() {
    }

    public ConseilSanteResponse(
            Long id,
            String titre,
            String contenu,
            CategorieConseil categorie,
            Boolean publie,
            LocalDateTime dateCreation,
            Long etablissementId,
            String etablissementNom,
            String pdfUrl,
            String pdfFileName
    ) {
        this.id = id;
        this.titre = titre;
        this.contenu = contenu;
        this.categorie = categorie;
        this.publie = publie;
        this.dateCreation = dateCreation;
        this.etablissementId = etablissementId;
        this.etablissementNom = etablissementNom;
        this.pdfUrl = pdfUrl;
        this.pdfFileName = pdfFileName;
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

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

    public String getPdfFileName() {
        return pdfFileName;
    }

    public void setPdfFileName(String pdfFileName) {
        this.pdfFileName = pdfFileName;
    }
}