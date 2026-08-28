package com.Stage.Dalil_sante.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Stage.Dalil_sante.dto.ConseilSanteCreateRequest;
import com.Stage.Dalil_sante.dto.ConseilSanteResponse;
import com.Stage.Dalil_sante.dto.ConseilSanteUpdateRequest;
import com.Stage.Dalil_sante.entity.ConseilSante;
import com.Stage.Dalil_sante.enums.CategorieConseil;
import com.Stage.Dalil_sante.service.ConseilSanteService;
import com.Stage.Dalil_sante.service.PdfStorageService;

import jakarta.annotation.security.PermitAll;

@RestController
@RequestMapping("/api/conseils-sante")
public class ConseilSanteController {

    private final ConseilSanteService conseilSanteService;
    private final PdfStorageService pdfStorageService;

    public ConseilSanteController(
            ConseilSanteService conseilSanteService,
            PdfStorageService pdfStorageService
    ) {
        this.conseilSanteService = conseilSanteService;
        this.pdfStorageService = pdfStorageService;
    }

    // ============================================================
    // CRÉER UN CONSEIL DE SANTÉ
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ConseilSanteResponse> createConseil(
            @RequestPart("metadata") ConseilSanteCreateRequest request,
            @RequestPart("pdf") MultipartFile pdf
    ) {

        ConseilSante conseil = new ConseilSante(
                request.getTitre(),
                request.getContenu(),
                request.getCategorie(),
                request.getPublie(),
                null
        );

        ConseilSante createdConseil =
                conseilSanteService.createConseil(
                        request.getEtablissementId(),
                        conseil,
                        pdf
                );

        return ResponseEntity.ok(
                toResponse(createdConseil)
        );
    }

    // ============================================================
    // RÉCUPÉRER TOUS LES CONSEILS
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ConseilSanteResponse>> getAllConseils() {

        List<ConseilSanteResponse> conseils =
                conseilSanteService.getAllConseils()
                        .stream()
                        .map(ConseilSanteController::toResponse)
                        .toList();

        return ResponseEntity.ok(conseils);
    }

    // ============================================================
    // RÉCUPÉRER UNIQUEMENT LES CONSEILS PUBLIÉS
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/published")
    public ResponseEntity<List<ConseilSanteResponse>> getPublishedConseils() {

        List<ConseilSanteResponse> conseils =
                conseilSanteService.getPublishedConseils()
                        .stream()
                        .map(ConseilSanteController::toResponse)
                        .toList();

        return ResponseEntity.ok(conseils);
    }

    // ============================================================
    // RÉCUPÉRER LES CONSEILS PUBLIÉS D'UNE CATÉGORIE
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/published/categorie/{categorie}")
    public ResponseEntity<List<ConseilSanteResponse>>
    getPublishedByCategorie(
            @PathVariable CategorieConseil categorie
    ) {

        List<ConseilSanteResponse> conseils =
                conseilSanteService
                        .getPublishedByCategorie(categorie)
                        .stream()
                        .map(ConseilSanteController::toResponse)
                        .toList();

        return ResponseEntity.ok(conseils);
    }

    // ============================================================
    // RÉCUPÉRER UN CONSEIL PAR ID
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/{id}")
    public ResponseEntity<ConseilSanteResponse> getConseilById(
            @PathVariable Long id
    ) {

        return conseilSanteService
                .getConseilById(id)
                .map(ConseilSanteController::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================
    // AFFICHER / TÉLÉCHARGER LE PDF
    // PUBLIC
    // ============================================================

    @PermitAll
    @GetMapping("/{id}/pdf")
    public ResponseEntity<Resource> getConseilPdf(
            @PathVariable Long id
    ) {

        ConseilSante conseil =
                conseilSanteService
                        .getConseilById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Conseil de santé introuvable avec l'ID : "
                                                + id
                                )
                        );

        Resource resource =
                pdfStorageService.load(
                        conseil.getPdfPath()
                );

        String fileName =
                conseil.getPdfFileName() != null
                        ? conseil.getPdfFileName()
                        : "document.pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\""
                                + fileName.replace("\"", "")
                                + "\""
                )
                .body(resource);
    }

    // ============================================================
    // MODIFIER UN CONSEIL
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ConseilSanteResponse> updateConseil(
            @PathVariable Long id,
            @RequestPart("metadata") ConseilSanteUpdateRequest request,
            @RequestPart(value = "pdf", required = false) MultipartFile pdf
    ) {

        ConseilSante conseil = new ConseilSante(
                request.getTitre(),
                request.getContenu(),
                request.getCategorie(),
                request.getPublie(),
                null
        );

        ConseilSante updatedConseil =
                conseilSanteService.updateConseil(
                        id,
                        request.getEtablissementId(),
                        conseil,
                        pdf
                );

        return ResponseEntity.ok(
                toResponse(updatedConseil)
        );
    }

    // ============================================================
    // SUPPRIMER UN CONSEIL
    // ADMIN uniquement
    // ============================================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConseil(
            @PathVariable Long id
    ) {

        conseilSanteService.deleteConseil(id);

        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // CONVERSION ENTITY → RESPONSE
    // ============================================================

    private static ConseilSanteResponse toResponse(
            ConseilSante conseil
    ) {

        Long etablissementId =
                conseil.getEtablissement() != null
                        ? conseil.getEtablissement().getId()
                        : null;

        String etablissementNom =
                conseil.getEtablissement() != null
                        ? conseil.getEtablissement().getNom()
                        : null;

        String pdfUrl =
                conseil.getPdfPath() != null
                        ? "/api/conseils-sante/"
                                + conseil.getId()
                                + "/pdf"
                        : null;

        return new ConseilSanteResponse(
                conseil.getId(),
                conseil.getTitre(),
                conseil.getContenu(),
                conseil.getCategorie(),
                conseil.getPublie(),
                conseil.getDateCreation(),
                etablissementId,
                etablissementNom,
                pdfUrl,
                conseil.getPdfFileName()
        );
    }
}