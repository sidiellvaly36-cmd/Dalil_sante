package com.Stage.Dalil_sante.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Stage.Dalil_sante.entity.Utilisateur;

public interface UtilisateurRepository
        extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);

    Optional<Utilisateur> findByTelephone(String telephone);

    Optional<Utilisateur> findByEmailOrTelephone(
            String email,
            String telephone
    );

    boolean existsByEmail(String email);

    boolean existsByTelephone(String telephone);

    List<Utilisateur> findByActifTrue();

    List<Utilisateur> findByNomContainingIgnoreCase(String nom);
}
