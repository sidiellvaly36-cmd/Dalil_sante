package com.Stage.Dalil_sante.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.Stage.Dalil_sante.entity.TypeEtablissement;
import com.Stage.Dalil_sante.entity.Utilisateur;
import com.Stage.Dalil_sante.enums.Role;
import com.Stage.Dalil_sante.repository.TypeEtablissementRepository;
import com.Stage.Dalil_sante.repository.UtilisateurRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final TypeEtablissementRepository typeEtablissementRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.telephone}")
    private String adminTelephone;

    public DataInitializer(
            UtilisateurRepository utilisateurRepository,
            TypeEtablissementRepository typeEtablissementRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.utilisateurRepository = utilisateurRepository;
        this.typeEtablissementRepository = typeEtablissementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initAdmin();
        initTypesEtablissement();
    }

    private void initAdmin() {
        if (utilisateurRepository.existsByRole(Role.ADMIN)) {
            return;
        }

        Utilisateur admin = new Utilisateur(
                "Super",
                "Admin",
                adminEmail,
                passwordEncoder.encode(adminPassword),
                adminTelephone,
                true,
                Role.ADMIN
        );

        utilisateurRepository.save(admin);

        System.out.println("======================================");
        System.out.println("Super Admin created successfully");
        System.out.println("Email    : " + adminEmail);
        System.out.println("Password : (definie via ADMIN_DEFAULT_PASSWORD, valeur par defaut si non surchargee)");
        System.out.println("A changer immediatement apres la premiere connexion.");
        System.out.println("======================================");
    }

    private void initTypesEtablissement() {
        record TypeInitData(String nom, String description) {}

        List<TypeInitData> types = List.of(
                new TypeInitData("Hôpital", "Établissement de soins hospitaliers et d'urgences"),
                new TypeInitData("Clinique", "Établissement de soins médico-chirurgicaux privé"),
                new TypeInitData("Cabinet médical", "Cabinet de consultations médicales générales ou spécialisées"),
                new TypeInitData("Centre de santé", "Structure de soins et consultations médicales de proximité"),
                new TypeInitData("Pharmacie", "Officine de délivrance de médicaments et conseils pharmaceutiques"),
                new TypeInitData("Laboratoire d’analyses", "Laboratoire d'analyses biomédicales et de diagnostic"),
                new TypeInitData("Centre d’imagerie médicale", "Centre d'examens radiologiques et d'imagerie diagnostique")
        );

        for (TypeInitData item : types) {
            String nom = item.nom();
            String altNom = nom.contains("’") ? nom.replace("’", "'") : nom.replace("'", "’");

            if (!typeEtablissementRepository.existsByNom(nom) && !typeEtablissementRepository.existsByNom(altNom)) {
                TypeEtablissement typeEtablissement = new TypeEtablissement(
                        nom,
                        item.description(),
                        true
                );
                typeEtablissementRepository.save(typeEtablissement);
                System.out.println("Type d'établissement initialisé : " + nom);
            }
        }
    }
}