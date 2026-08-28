package com.Stage.Dalil_sante.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.Stage.Dalil_sante.dto.EvolutionPointItem;
import com.Stage.Dalil_sante.dto.RechercheFrequenteItem;
import com.Stage.Dalil_sante.dto.RepartitionTypeItem;
import com.Stage.Dalil_sante.dto.StatistiqueRechercheResponse;
import com.Stage.Dalil_sante.entity.RechercheLog;
import com.Stage.Dalil_sante.entity.Utilisateur;
import com.Stage.Dalil_sante.enums.TypeRecherche;
import com.Stage.Dalil_sante.repository.RechercheLogRepository;
import com.Stage.Dalil_sante.repository.UtilisateurRepository;

@Service
public class RechercheLogService {

    private static final int TOP_RECHERCHES_LIMIT = 10;
    private static final int JOURS_EVOLUTION = 14;
    private static final int MOIS_EVOLUTION = 12;
    private static final int ANNEES_EVOLUTION = 5;

    private final RechercheLogRepository rechercheLogRepository;
    private final UtilisateurRepository utilisateurRepository;

    public RechercheLogService(
            RechercheLogRepository rechercheLogRepository,
            UtilisateurRepository utilisateurRepository
    ) {
        this.rechercheLogRepository = rechercheLogRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    /**
     * Enregistre une recherche réellement exécutée (jamais appelé à chaque
     * frappe clavier - voir UserSearch.tsx). L'échec de résolution de
     * l'utilisateur (cas limite théorique) n'empêche jamais l'enregistrement :
     * la recherche est journalisée avec utilisateur=null plutôt que de faire
     * échouer l'expérience de recherche de l'UTILISATEUR.
     */
    public void enregistrerRecherche(TypeRecherche type, String query, String email) {

        Utilisateur utilisateur = email != null
                ? utilisateurRepository.findByEmail(email).orElse(null)
                : null;

        RechercheLog log = new RechercheLog(type, query.trim(), utilisateur);

        rechercheLogRepository.save(log);
    }

    public StatistiqueRechercheResponse getStatistiques() {

        LocalDateTime debutAujourdHui = LocalDate.now().atStartOfDay();
        LocalDateTime debutCeMois = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime debutCetteAnnee = LocalDate.now().withDayOfYear(1).atStartOfDay();
        LocalDateTime maintenant = LocalDateTime.now();

        long total = rechercheLogRepository.count();
        long aujourdHui = rechercheLogRepository.countByDateRechercheBetween(debutAujourdHui, maintenant);
        long ceMois = rechercheLogRepository.countByDateRechercheBetween(debutCeMois, maintenant);
        long cetteAnnee = rechercheLogRepository.countByDateRechercheBetween(debutCetteAnnee, maintenant);

        List<RepartitionTypeItem> repartition = rechercheLogRepository.repartitionParType()
                .stream()
                .map(p -> new RepartitionTypeItem(p.getType(), p.getNombre()))
                .toList();

        List<RechercheFrequenteItem> frequentes = rechercheLogRepository
                .recherchesFrequentes(PageRequest.of(0, TOP_RECHERCHES_LIMIT))
                .stream()
                .map(p -> new RechercheFrequenteItem(p.getQuery(), p.getType(), p.getNombre()))
                .toList();

        return new StatistiqueRechercheResponse(
                total,
                aujourdHui,
                ceMois,
                cetteAnnee,
                repartition,
                frequentes,
                evolutionParJour(),
                evolutionParMois(),
                evolutionParAnnee()
        );
    }

    private List<EvolutionPointItem> evolutionParJour() {

        LocalDate aujourdHui = LocalDate.now();
        LocalDate debut = aujourdHui.minusDays(JOURS_EVOLUTION - 1);
        DateTimeFormatter cle = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter affichage = DateTimeFormatter.ofPattern("dd/MM");

        Map<String, Long> comptes = compterParPeriode("day", debut.atStartOfDay(), cle);

        List<EvolutionPointItem> points = new ArrayList<>();
        for (int i = 0; i < JOURS_EVOLUTION; i++) {
            LocalDate jour = debut.plusDays(i);
            long nombre = comptes.getOrDefault(jour.format(cle), 0L);
            points.add(new EvolutionPointItem(jour.format(affichage), nombre));
        }
        return points;
    }

    private List<EvolutionPointItem> evolutionParMois() {

        YearMonth moisActuel = YearMonth.now();
        YearMonth debut = moisActuel.minusMonths(MOIS_EVOLUTION - 1);
        DateTimeFormatter cle = DateTimeFormatter.ofPattern("yyyy-MM");
        DateTimeFormatter affichage = DateTimeFormatter.ofPattern("MM/yyyy");

        Map<String, Long> comptes = compterParPeriode("month", debut.atDay(1).atStartOfDay(), cle);

        List<EvolutionPointItem> points = new ArrayList<>();
        for (int i = 0; i < MOIS_EVOLUTION; i++) {
            YearMonth mois = debut.plusMonths(i);
            long nombre = comptes.getOrDefault(mois.format(cle), 0L);
            points.add(new EvolutionPointItem(mois.format(affichage), nombre));
        }
        return points;
    }

    private List<EvolutionPointItem> evolutionParAnnee() {

        int anneeActuelle = LocalDate.now().getYear();
        int anneeDebut = anneeActuelle - (ANNEES_EVOLUTION - 1);
        DateTimeFormatter cle = DateTimeFormatter.ofPattern("yyyy");

        Map<String, Long> comptes = compterParPeriode(
                "year",
                LocalDate.of(anneeDebut, 1, 1).atStartOfDay(),
                cle
        );

        List<EvolutionPointItem> points = new ArrayList<>();
        for (int i = 0; i < ANNEES_EVOLUTION; i++) {
            int annee = anneeDebut + i;
            long nombre = comptes.getOrDefault(String.valueOf(annee), 0L);
            points.add(new EvolutionPointItem(String.valueOf(annee), nombre));
        }
        return points;
    }

    /**
     * Interroge PostgreSQL (date_trunc, agrégation réelle en base) et
     * retourne une correspondance clé-de-période -> nombre, prête à combler
     * les périodes vides avec un vrai zéro (jamais une donnée inventée).
     */
    private Map<String, Long> compterParPeriode(String unit, LocalDateTime depuis, DateTimeFormatter cle) {

        Map<String, Long> resultat = new LinkedHashMap<>();

        for (Object[] ligne : rechercheLogRepository.evolution(unit, depuis)) {
            LocalDateTime periode = ligne[0] instanceof LocalDateTime localDateTime
                    ? localDateTime
                    : ((java.sql.Timestamp) ligne[0]).toLocalDateTime();
            long nombre = ((Number) ligne[1]).longValue();
            resultat.put(periode.format(cle), nombre);
        }

        return resultat;
    }
}