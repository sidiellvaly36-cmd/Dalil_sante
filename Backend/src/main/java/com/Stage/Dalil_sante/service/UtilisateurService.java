package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.Utilisateur;
import com.Stage.Dalil_sante.repository.UtilisateurRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(
            UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Créer un utilisateur
    public Utilisateur createUtilisateur(
            Utilisateur utilisateur
    ) {

        if (utilisateurRepository
                .existsByEmail(utilisateur.getEmail())) {

            throw new RuntimeException(
                    "Un utilisateur avec cet email existe déjà"
            );
        }

        utilisateur.setPassword(
                passwordEncoder.encode(utilisateur.getPassword())
        );

        return utilisateurRepository.save(utilisateur);
    }

    // Récupérer tous les utilisateurs
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    // Récupérer les utilisateurs actifs
    public List<Utilisateur> getActiveUtilisateurs() {
        return utilisateurRepository.findByActifTrue();
    }

    // Récupérer un utilisateur par ID
    public Optional<Utilisateur> getUtilisateurById(
            Long id
    ) {
        return utilisateurRepository.findById(id);
    }

    // Récupérer un utilisateur par email
    public Optional<Utilisateur> getUtilisateurByEmail(
            String email
    ) {
        return utilisateurRepository.findByEmail(email);
    }

    // Rechercher un utilisateur par nom
    public List<Utilisateur> searchByNom(
            String nom
    ) {
        return utilisateurRepository
                .findByNomContainingIgnoreCase(nom);
    }

    // Modifier un utilisateur
    public Utilisateur updateUtilisateur(
            Long id,
            Utilisateur newUtilisateur
    ) {

        Utilisateur existingUtilisateur =
                utilisateurRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Utilisateur introuvable avec l'ID : "
                                                + id
                                )
                        );

        if (!existingUtilisateur.getEmail()
                .equals(newUtilisateur.getEmail())
                && utilisateurRepository
                .existsByEmail(newUtilisateur.getEmail())) {

            throw new RuntimeException(
                    "Un utilisateur avec cet email existe déjà"
            );
        }

        existingUtilisateur.setNom(
                newUtilisateur.getNom()
        );

        existingUtilisateur.setPrenom(
                newUtilisateur.getPrenom()
        );

        existingUtilisateur.setEmail(
                newUtilisateur.getEmail()
        );

        existingUtilisateur.setTelephone(
                newUtilisateur.getTelephone()
        );

        existingUtilisateur.setActif(
                newUtilisateur.getActif()
        );

        return utilisateurRepository.save(
                existingUtilisateur
        );
    }

    // Supprimer un utilisateur
    public void deleteUtilisateur(Long id) {

        if (!utilisateurRepository.existsById(id)) {

            throw new RuntimeException(
                    "Utilisateur introuvable avec l'ID : "
                            + id
            );
        }

        utilisateurRepository.deleteById(id);
    }
}
