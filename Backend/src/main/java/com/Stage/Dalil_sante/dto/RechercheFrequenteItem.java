package com.Stage.Dalil_sante.dto;

import com.Stage.Dalil_sante.enums.TypeRecherche;

public class RechercheFrequenteItem {

    private String query;
    private TypeRecherche type;
    private long nombre;

    public RechercheFrequenteItem() {
    }

    public RechercheFrequenteItem(String query, TypeRecherche type, long nombre) {
        this.query = query;
        this.type = type;
        this.nombre = nombre;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public TypeRecherche getType() {
        return type;
    }

    public void setType(TypeRecherche type) {
        this.type = type;
    }

    public long getNombre() {
        return nombre;
    }

    public void setNombre(long nombre) {
        this.nombre = nombre;
    }
}