package com.Stage.Dalil_sante.dto;

public class LoginResponse {

    private String token;

    private Long utilisateurId;

    private String nomComplet;

    private String email;

    private String telephone;

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            Long utilisateurId,
            String nomComplet,
            String email,
            String telephone
    ) {
        this.token = token;
        this.utilisateurId = utilisateurId;
        this.nomComplet = nomComplet;
        this.email = email;
        this.telephone = telephone;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUtilisateurId() {
        return utilisateurId;
    }

    public void setUtilisateurId(Long utilisateurId) {
        this.utilisateurId = utilisateurId;
    }

    public String getNomComplet() {
        return nomComplet;
    }

    public void setNomComplet(String nomComplet) {
        this.nomComplet = nomComplet;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
}