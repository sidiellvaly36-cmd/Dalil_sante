package com.Stage.Dalil_sante.support;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import com.Stage.Dalil_sante.entity.Utilisateur;
import com.Stage.Dalil_sante.enums.Role;
import com.Stage.Dalil_sante.repository.UtilisateurRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Base commune pour les tests d'intégration Security/API.
 *
 * Chaque test s'exécute dans une transaction (@Transactional) annulée
 * (rollback) automatiquement à la fin, sur la base PostgreSQL locale
 * existante : aucune donnée créée par les tests ne persiste, et aucune
 * donnée déjà présente n'est lue comme prérequis (chaque test crée ses
 * propres utilisateurs avec des email/téléphone uniques via UUID).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Transactional
public abstract class IntegrationTestBase {

    protected static final String DEFAULT_TEST_PASSWORD = "Test@1234";

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected UtilisateurRepository utilisateurRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    /**
     * Instance locale plutôt qu'injectée : ce contexte Spring Boot 4.1
     * n'enregistre pas de bean ObjectMapper autowirable (seule
     * l'infrastructure interne des HttpMessageConverters de webmvc en a
     * un), donc @Autowired échoue ici. Une instance dédiée au test suffit
     * pour lire les réponses JSON dans les assertions.
     */
    protected final ObjectMapper objectMapper = new ObjectMapper();

    protected String uniqueEmail(String prefix) {
        return prefix + "-" + UUID.randomUUID() + "@test.local";
    }

    protected String uniquePhone() {

        long value = Math.abs(UUID.randomUUID().getMostSignificantBits()) % 100_000_000L;

        return String.format("%08d", value);
    }

    protected String uniqueName(String prefix) {
        return prefix + "-" + UUID.randomUUID();
    }

    protected Utilisateur createTestUser(Role role, boolean actif) {

        Utilisateur utilisateur = new Utilisateur(
                "Test",
                "User",
                uniqueEmail("user"),
                passwordEncoder.encode(DEFAULT_TEST_PASSWORD),
                uniquePhone(),
                actif,
                role
        );

        return utilisateurRepository.save(utilisateur);
    }

    protected String loginAndGetToken(String identifiant, String password) throws Exception {

        String body = """
                {"identifiant":"%s","password":"%s"}
                """.formatted(identifiant, password);

        MvcResult result = mockMvc.perform(
                        post("/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(
                result.getResponse().getContentAsString()
        );

        return json.get("token").asText();
    }

    protected String bearer(String token) {
        return "Bearer " + token;
    }
}