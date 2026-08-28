package com.Stage.Dalil_sante.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;

import com.Stage.Dalil_sante.entity.Utilisateur;
import com.Stage.Dalil_sante.enums.Role;
import com.Stage.Dalil_sante.support.IntegrationTestBase;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthenticationIntegrationTest extends IntegrationTestBase {

    private static final String WRONG_SECRET =
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    @Value("${jwt.secret}")
    private String realJwtSecret;

    @Test
    void login_withValidCredentials_returnsTokenAndProfile() throws Exception {

        Utilisateur user = createTestUser(Role.UTILISATEUR, true);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"identifiant":"%s","password":"%s"}
                                """.formatted(user.getEmail(), DEFAULT_TEST_PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(user.getEmail()));
    }

    @Test
    void login_withWrongPassword_returnsUnauthorized() throws Exception {

        Utilisateur user = createTestUser(Role.UTILISATEUR, true);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"identifiant":"%s","password":"WrongPassword123"}
                                """.formatted(user.getEmail())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_withInactiveAccount_returnsUnauthorized() throws Exception {

        Utilisateur user = createTestUser(Role.UTILISATEUR, false);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"identifiant":"%s","password":"%s"}
                                """.formatted(user.getEmail(), DEFAULT_TEST_PASSWORD)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void register_withNewUser_returnsTokenAndDefaultsToUtilisateurRole() throws Exception {

        String email = uniqueEmail("register");
        String telephone = uniquePhone();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nom":"Nouveau","prenom":"Utilisateur","email":"%s","password":"Password123","telephone":"%s"}
                                """.formatted(email, telephone)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());

        Utilisateur saved = utilisateurRepository.findByEmail(email).orElseThrow();

        Assertions.assertEquals(Role.UTILISATEUR, saved.getRole());
    }

    @Test
    void register_withDuplicateEmail_returnsConflict() throws Exception {

        Utilisateur existing = createTestUser(Role.UTILISATEUR, true);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nom":"Dup","prenom":"User","email":"%s","password":"Password123","telephone":"%s"}
                                """.formatted(existing.getEmail(), uniquePhone())))
                .andExpect(status().isConflict());
    }

    @Test
    void me_withoutJwt_isRejected() throws Exception {

        mockMvc.perform(get("/auth/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    void changePassword_withoutJwt_isRejected() throws Exception {

        mockMvc.perform(put("/auth/change-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"currentPassword":"a","newPassword":"bbbbbb","confirmPassword":"bbbbbb"}
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    void protectedEndpoint_withMalformedJwt_returnsUnauthorized() throws Exception {

        mockMvc.perform(get("/api/types-etablissement")
                        .header("Authorization", bearer("not.a.valid.jwt")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpoint_withExpiredJwt_returnsUnauthorized() throws Exception {

        String expiredToken = craftToken(realJwtSecret, "someone@test.local", -10_000);

        mockMvc.perform(get("/api/types-etablissement")
                        .header("Authorization", bearer(expiredToken)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpoint_withWrongSignatureJwt_returnsUnauthorized() throws Exception {

        String wrongSignatureToken = craftToken(WRONG_SECRET, "someone@test.local", 60_000);

        mockMvc.perform(get("/api/types-etablissement")
                        .header("Authorization", bearer(wrongSignatureToken)))
                .andExpect(status().isUnauthorized());
    }

    private String craftToken(String secret, String subject, long expiresInMillisFromNow) {

        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiresInMillisFromNow))
                .signWith(key)
                .compact();
    }
}