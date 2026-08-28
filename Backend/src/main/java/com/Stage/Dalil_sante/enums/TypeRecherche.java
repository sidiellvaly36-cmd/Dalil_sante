package com.Stage.Dalil_sante.enums;

/**
 * Types de recherche réels effectués par un UTILISATEUR sur la plateforme
 * (voir UserSearch.tsx) : recherche par nom d'établissement, sélection d'une
 * spécialité médicale, d'un service médical, ou d'un type d'établissement.
 * Aucun autre type n'est inventé.
 */
public enum TypeRecherche {
    ETABLISSEMENT,
    SPECIALITE,
    SERVICE,
    TYPE_ETABLISSEMENT
}