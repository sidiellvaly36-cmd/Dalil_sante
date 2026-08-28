package com.Stage.Dalil_sante.dto;

public class EvolutionPointItem {

    private String label;
    private long nombre;

    public EvolutionPointItem() {
    }

    public EvolutionPointItem(String label, long nombre) {
        this.label = label;
        this.nombre = nombre;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public long getNombre() {
        return nombre;
    }

    public void setNombre(long nombre) {
        this.nombre = nombre;
    }
}