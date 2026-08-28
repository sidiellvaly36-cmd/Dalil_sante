package com.Stage.Dalil_sante.dto;

import com.Stage.Dalil_sante.enums.TypeRecherche;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** Corps de POST /api/statistiques/recherches - enregistre une recherche réellement exécutée. */
public class RechercheLogRequest {

    @NotNull(message = "Le type de recherche est obligatoire")
    private TypeRecherche type;

    @NotBlank(message = "Le terme recherché est obligatoire")
    private String query;

    public RechercheLogRequest() {
    }

    public RechercheLogRequest(TypeRecherche type, String query) {
        this.type = type;
        this.query = query;
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
}