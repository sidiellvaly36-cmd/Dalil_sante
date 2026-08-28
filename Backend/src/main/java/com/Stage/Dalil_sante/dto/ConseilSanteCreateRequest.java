package com.Stage.Dalil_sante.dto;

import com.Stage.Dalil_sante.enums.CategorieConseil;

public class ConseilSanteCreateRequest {

    private String titre;

    private String contenu;

    private CategorieConseil categorie;

    private Boolean publie = false;

    private Long etablissementId;

    public ConseilSanteCreateRequest() {
    }

    public ConseilSanteCreateRequest(
            String titre,
            String contenu,
            CategorieConseil categorie,
            Boolean publie,
            Long etablissementId
    ) {
        this.titre = titre;
        this.contenu = contenu;
        this.categorie = categorie;
        this.publie = publie;
        this.etablissementId = etablissementId;
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

    public Long getEtablissementId() {
        return etablissementId;
    }

    public void setEtablissementId(Long etablissementId) {
        this.etablissementId = etablissementId;
    }
}