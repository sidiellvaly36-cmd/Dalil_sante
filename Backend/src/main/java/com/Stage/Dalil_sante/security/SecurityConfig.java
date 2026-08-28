package com.Stage.Dalil_sante.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(Customizer.withDefaults())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // =====================================================
                        // AUTHENTICATION
                        // =====================================================

                        .requestMatchers(
                                "/auth/login",
                                "/auth/register"
                        ).permitAll()


                        // =====================================================
                        // ESPACE PUBLIC - LECTURE SEULE
                        // =====================================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/etablissements"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/etablissements/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/types-etablissement"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/types-etablissement/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/specialites-medicales"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/specialites-medicales/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/services-medicaux"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/services-medicaux/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/localisations"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/localisations/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/numeros-urgence"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/numeros-urgence/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/conseils-sante/published"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/conseils-sante/*"
                        ).permitAll()


                        // =====================================================
                        // TOUT LE RESTE RESTE PROTÉGÉ
                        // =====================================================

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:8080"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type"
        ));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}