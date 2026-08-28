package com.Stage.Dalil_sante.security;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import com.Stage.Dalil_sante.entity.Utilisateur;
import com.Stage.Dalil_sante.enums.Role;
import com.Stage.Dalil_sante.support.IntegrationTestBase;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthorizationIntegrationTest extends IntegrationTestBase {

    @Test
    void utilisateur_creatingType_isForbidden() throws Exception {

        Utilisateur user = createTestUser(Role.UTILISATEUR, true);
        String token = loginAndGetToken(user.getEmail(), DEFAULT_TEST_PASSWORD);

        mockMvc.perform(post("/api/types-etablissement")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nom":"%s","description":"desc","actif":true}
                                """.formatted(uniqueName("Type"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void admin_creatingType_succeeds() throws Exception {

        Utilisateur admin = createTestUser(Role.ADMIN, true);
        String token = loginAndGetToken(admin.getEmail(), DEFAULT_TEST_PASSWORD);

        mockMvc.perform(post("/api/types-etablissement")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nom":"%s","description":"desc","actif":true}
                                """.formatted(uniqueName("Type"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNotEmpty());
    }

    @Test
    void utilisateur_canReadAllowedGetEndpoints() throws Exception {

        Utilisateur user = createTestUser(Role.UTILISATEUR, true);
        String token = loginAndGetToken(user.getEmail(), DEFAULT_TEST_PASSWORD);

        mockMvc.perform(get("/api/types-etablissement")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/etablissements")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isOk());
    }

    @Test
    void utilisateur_isDeniedOnUtilisateurControllerEvenForGet() throws Exception {

        Utilisateur user = createTestUser(Role.UTILISATEUR, true);
        String token = loginAndGetToken(user.getEmail(), DEFAULT_TEST_PASSWORD);

        mockMvc.perform(get("/api/utilisateurs")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isForbidden());
    }
}