package com.Stage.Dalil_sante.dto;

import com.Stage.Dalil_sante.enums.TypeRecherche;

public class RepartitionTypeItem {

    private TypeRecherche type;
    private long nombre;

    public RepartitionTypeItem() {
    }

    public RepartitionTypeItem(TypeRecherche type, long nombre) {
        this.type = type;
        this.nombre = nombre;
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