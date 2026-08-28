package com.Stage.Dalil_sante.service;

import com.Stage.Dalil_sante.entity.ConseilSante;
import com.Stage.Dalil_sante.entity.EtablissementSante;
import com.Stage.Dalil_sante.enums.CategorieConseil;
import com.Stage.Dalil_sante.repository.ConseilSanteRepository;
import com.Stage.Dalil_sante.repository.EtablissementSanteRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class ConseilSanteService {

    private final ConseilSanteRepository conseilSanteRepository;
    private final EtablissementSanteRepository etablissementSanteRepository;
    private final PdfStorageService pdfStorageService;

    public ConseilSanteService(
            ConseilSanteRepository conseilSanteRepository,
            EtablissementSanteRepository etablissementSanteRepository,
            PdfStorageService pdfStorageService
    ) {
        this.conseilSanteRepository = conseilSanteRepository;
        this.etablissementSanteRepository = etablissementSanteRepository;
        this.pdfStorageService = pdfStorageService;
    }

    // Créer un conseil de santé (etablissementId optionnel, PDF obligatoire)
    public ConseilSante createConseil(
            Long etablissementId,
            ConseilSante conseil,
            MultipartFile pdf
    ) {

        if (etablissementId != null) {
            conseil.setEtablissement(
                    getEtablissementOrThrow(etablissementId)
            );
        }

        String storedName = pdfStorageService.store(pdf);
        conseil.setPdfPath(storedName);
        conseil.setPdfFileName(pdfStorageService.resolveOriginalFileName(pdf));

        // Si l'enregistrement en base échoue après coup (contrainte, etc.), le
        // fichier déjà écrit sur disque ne doit jamais rester orphelin.
        try {
            return conseilSanteRepository.save(conseil);
        } catch (RuntimeException e) {
            pdfStorageService.delete(storedName);
            throw e;
        }
    }

    // Récupérer tous les conseils (publiés et non publiés) - vue ADMIN
    public List<ConseilSante> getAllConseils() {
        return conseilSanteRepository.findAll();
    }

    // Récupérer uniquement les conseils publiés - vue UTILISATEUR
    public List<ConseilSante> getPublishedConseils() {
        return conseilSanteRepository.findByPublieTrue();
    }

    // Récupérer les conseils publiés d'une catégorie précise
    public List<ConseilSante> getPublishedByCategorie(
            CategorieConseil categorie
    ) {
        return conseilSanteRepository
                .findByPublieTrueAndCategorie(categorie);
    }

    // Récupérer un conseil par ID
    public Optional<ConseilSante> getConseilById(Long id) {
        return conseilSanteRepository.findById(id);
    }

    /**
     * Modifier un conseil (titre, contenu, catégorie, publication,
     * établissement, PDF optionnel). Le contenu texte historique
     * (anciens conseils) n'est écrasé que si une nouvelle valeur non nulle
     * est fournie - le formulaire ADMIN actuel n'envoie plus jamais ce champ,
     * donc les anciens conseils texte ne sont jamais vidés par erreur.
     * Si un nouveau PDF est fourni, l'ancien fichier est supprimé du disque
     * et remplacé ; sinon le PDF existant est conservé tel quel.
     */
    public ConseilSante updateConseil(
            Long id,
            Long etablissementId,
            ConseilSante newConseil,
            MultipartFile pdf
    ) {

        ConseilSante existingConseil = conseilSanteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Conseil de santé introuvable avec l'ID : " + id
                        )
                );

        existingConseil.setTitre(newConseil.getTitre());

        if (newConseil.getContenu() != null) {
            existingConseil.setContenu(newConseil.getContenu());
        }

        existingConseil.setCategorie(newConseil.getCategorie());
        existingConseil.setPublie(newConseil.getPublie());

        if (etablissementId != null) {
            existingConseil.setEtablissement(
                    getEtablissementOrThrow(etablissementId)
            );
        } else {
            existingConseil.setEtablissement(null);
        }

        // Remplacement de PDF : on écrit d'abord le nouveau fichier et on ne
        // supprime l'ancien qu'après le succès de l'enregistrement en base,
        // pour ne jamais perdre le fichier existant ni laisser un fichier
        // orphelin si la sauvegarde échoue.
        String oldPdfPath = existingConseil.getPdfPath();
        String newStoredName = null;

        if (pdf != null && !pdf.isEmpty()) {
            newStoredName = pdfStorageService.store(pdf);
            existingConseil.setPdfPath(newStoredName);
            existingConseil.setPdfFileName(pdfStorageService.resolveOriginalFileName(pdf));
        }

        try {
            ConseilSante saved = conseilSanteRepository.save(existingConseil);

            if (newStoredName != null && oldPdfPath != null) {
                pdfStorageService.delete(oldPdfPath);
            }

            return saved;
        } catch (RuntimeException e) {
            if (newStoredName != null) {
                pdfStorageService.delete(newStoredName);
            }
            throw e;
        }
    }

    // Supprimer un conseil (et son PDF associé sur disque, s'il existe)
    public void deleteConseil(Long id) {

        ConseilSante existing = conseilSanteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Conseil de santé introuvable avec l'ID : " + id
                        )
                );

        pdfStorageService.delete(existing.getPdfPath());

        conseilSanteRepository.deleteById(id);
    }

    private EtablissementSante getEtablissementOrThrow(Long id) {
        return etablissementSanteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Établissement de santé introuvable avec l'ID : " + id
                        )
                );
    }
}