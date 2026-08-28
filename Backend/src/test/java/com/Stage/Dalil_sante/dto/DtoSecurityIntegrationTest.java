package com.Stage.Dalil_sante.dto;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import com.Stage.Dalil_sante.entity.OrientationResult;
import com.Stage.Dalil_sante.entity.Utilisateur;
import com.Stage.Dalil_sante.enums.Role;
import com.Stage.Dalil_sante.repository.OrientationResultRepository;
import com.Stage.Dalil_sante.support.IntegrationTestBase;
import com.fasterxml.jackson.databind.JsonNode;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DtoSecurityIntegrationTest extends IntegrationTestBase {

    @Autowired
    private OrientationResultRepository orientationResultRepository;

    @Test
    void utilisateurResponses_neverExposePassword() throws Exception {

        Utilisateur admin = createTestUser(Role.ADMIN, true);
        String adminToken = loginAndGetToken(admin.getEmail(), DEFAULT_TEST_PASSWORD);

        mockMvc.perform(get("/api/utilisateurs")
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].password").doesNotExist());

        mockMvc.perform(get("/api/utilisateurs/" + admin.getId())
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.password").doesNotExist());

        mockMvc.perform(get("/auth/me")
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void updateRequest_cannotEscalateRoleViaExtraJsonField() throws Exception {

        Utilisateur admin = createTestUser(Role.ADMIN, true);
        String adminToken = loginAndGetToken(admin.getEmail(), DEFAULT_TEST_PASSWORD);

        Utilisateur target = createTestUser(Role.UTILISATEUR, true);

        mockMvc.perform(put("/api/utilisateurs/" + target.getId())
                        .header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nom":"Modifie","prenom":"%s","email":"%s","telephone":"%s","actif":true,"role":"ADMIN"}
                                """.formatted(
                                target.getPrenom(),
                                target.getEmail(),
                                target.getTelephone()
                        )))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("UTILISATEUR"));

        Utilisateur reloaded = utilisateurRepository.findById(target.getId()).orElseThrow();

        assertEquals(Role.UTILISATEUR, reloaded.getRole());
    }

    @Test
    void createRequest_ignoresClientSuppliedIdActifAndRelations() throws Exception {

        Utilisateur admin = createTestUser(Role.ADMIN, true);
        String adminToken = loginAndGetToken(admin.getEmail(), DEFAULT_TEST_PASSWORD);

        String email = uniqueEmail("overpost");
        String telephone = uniquePhone();

        MvcResult result = mockMvc.perform(post("/api/utilisateurs")
                        .header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"id":999999,"nom":"Over","prenom":"Post","email":"%s","password":"Password123","telephone":"%s","role":"UTILISATEUR","actif":false,"etablissements":[{"id":1}]}
                                """.formatted(email, telephone)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.actif").value(true))
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        long generatedId = json.get("id").asLong();

        assertNotEquals(999999L, generatedId);

        Utilisateur saved = utilisateurRepository.findById(generatedId).orElseThrow();

        assertTrue(saved.getEtablissements().isEmpty());
        assertTrue(saved.getActif());
    }

    @Test
    void orientationResultRequest_ignoresUtilisateurRelationFromJson() throws Exception {

        Utilisateur admin = createTestUser(Role.ADMIN, true);
        String adminToken = loginAndGetToken(admin.getEmail(), DEFAULT_TEST_PASSWORD);

        Utilisateur otherUser = createTestUser(Role.UTILISATEUR, true);

        MvcResult result = mockMvc.perform(post("/api/orientation/results")
                        .header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"%s","description":"desc","urgencyLevel":"LOW","recommendedSpecialty":"x","recommendedEstablishmentType":"y","active":true,"utilisateur":{"id":%d}}
                                """.formatted(uniqueName("Result"), otherUser.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.utilisateur").doesNotExist())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        long resultId = json.get("id").asLong();

        OrientationResult saved = orientationResultRepository.findById(resultId).orElseThrow();

        assertNull(saved.getUtilisateur());
    }

    @Test
    void responses_doNotExposeBidirectionalRelations() throws Exception {

        Utilisateur admin = createTestUser(Role.ADMIN, true);
        String adminToken = loginAndGetToken(admin.getEmail(), DEFAULT_TEST_PASSWORD);

        mockMvc.perform(post("/api/specialites-medicales")
                        .header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nom":"%s","description":"desc","actif":true}
                                """.formatted(uniqueName("Specialite"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.utilisateurs").doesNotExist());

        mockMvc.perform(get("/api/utilisateurs/" + admin.getId())
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.etablissements").doesNotExist())
                .andExpect(jsonPath("$.specialites").doesNotExist())
                .andExpect(jsonPath("$.services").doesNotExist())
                .andExpect(jsonPath("$.numerosUrgence").doesNotExist())
                .andExpect(jsonPath("$.orientationResults").doesNotExist());
    }
}