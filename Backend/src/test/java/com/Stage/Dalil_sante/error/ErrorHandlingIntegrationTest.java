package com.Stage.Dalil_sante.error;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import com.Stage.Dalil_sante.entity.Utilisateur;
import com.Stage.Dalil_sante.enums.Role;
import com.Stage.Dalil_sante.support.IntegrationTestBase;
import com.fasterxml.jackson.databind.JsonNode;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ErrorHandlingIntegrationTest extends IntegrationTestBase {

    @Test
    void getById_afterDeletion_returnsNotFound() throws Exception {

        Utilisateur admin = createTestUser(Role.ADMIN, true);
        String token = loginAndGetToken(admin.getEmail(), DEFAULT_TEST_PASSWORD);

        long id = createType(token, uniqueName("ToDelete"));

        mockMvc.perform(delete("/api/types-etablissement/" + id)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/types-etablissement/" + id)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateNonExistentResource_returnsNotFound() throws Exception {

        Utilisateur admin = createTestUser(Role.ADMIN, true);
        String token = loginAndGetToken(admin.getEmail(), DEFAULT_TEST_PASSWORD);

        long id = createType(token, uniqueName("ToDelete2"));

        mockMvc.perform(delete("/api/types-etablissement/" + id)
                        .header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());

        mockMvc.perform(put("/api/types-etablissement/" + id)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nom":"%s","description":"desc","actif":true}
                                """.formatted(uniqueName("Updated"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void registerWithInvalidBody_returnsBadRequest() throws Exception {

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nom":"","prenom":"","email":"invalid-email","password":"123","telephone":""}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createUtilisateurWithInvalidBody_returnsBadRequest() throws Exception {

        Utilisateur admin = createTestUser(Role.ADMIN, true);
        String token = loginAndGetToken(admin.getEmail(), DEFAULT_TEST_PASSWORD);

        mockMvc.perform(post("/api/utilisateurs")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nom":"","prenom":"","email":"invalid","password":"123","telephone":""}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createDuplicateTypeEtablissement_returnsConflict() throws Exception {

        Utilisateur admin = createTestUser(Role.ADMIN, true);
        String token = loginAndGetToken(admin.getEmail(), DEFAULT_TEST_PASSWORD);

        String nom = uniqueName("Duplicate");

        createType(token, nom);

        mockMvc.perform(post("/api/types-etablissement")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nom":"%s","description":"autre desc","actif":true}
                                """.formatted(nom)))
                .andExpect(status().isConflict());
    }

    private long createType(String token, String nom) throws Exception {

        MvcResult created = mockMvc.perform(post("/api/types-etablissement")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nom":"%s","description":"desc","actif":true}
                                """.formatted(nom)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(created.getResponse().getContentAsString());

        return json.get("id").asLong();
    }
}