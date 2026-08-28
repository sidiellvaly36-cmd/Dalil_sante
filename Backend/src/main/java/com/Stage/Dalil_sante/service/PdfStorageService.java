package com.Stage.Dalil_sante.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Locale;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.Stage.Dalil_sante.exception.PdfValidationException;

/**
 * Stockage local des fichiers PDF des conseils de santé (aucun système de
 * stockage/fichiers n'existait dans le projet avant cette fonctionnalité -
 * vérifié : aucune trace de MultipartFile/upload ailleurs dans le Backend).
 * Les fichiers sont écrits sur disque sous {@code app.upload.dir} (jamais en
 * Base64 dans PostgreSQL) ; seul le nom de fichier stocké (UUID) est
 * persisté sur l'entité ConseilSante, jamais le chemin absolu.
 */
@Service
public class PdfStorageService {

    private static final byte[] PDF_SIGNATURE = {0x25, 0x50, 0x44, 0x46, 0x2D}; // "%PDF-"

    private final Path uploadDir;
    private final long maxSizeBytes;
    private final int maxSizeMb;

    public PdfStorageService(
            @Value("${app.upload.dir:uploads/conseils}") String uploadDirPath,
            @Value("${app.upload.max-pdf-size-mb:10}") int maxSizeMb
    ) {
        this.uploadDir = Paths.get(uploadDirPath).toAbsolutePath().normalize();
        this.maxSizeMb = maxSizeMb;
        this.maxSizeBytes = (long) maxSizeMb * 1024 * 1024;

        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Impossible de créer le dossier de stockage des fichiers PDF.", e
            );
        }
    }

    /** Valide puis enregistre le PDF sur disque, retourne le nom de fichier stocké (à persister). */
    public String store(MultipartFile file) {
        validate(file);

        String storedName = UUID.randomUUID() + ".pdf";
        Path target = uploadDir.resolve(storedName);

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Impossible d'enregistrer le fichier PDF.", e);
        }

        return storedName;
    }

    /** Nom de fichier original nettoyé, pour affichage/téléchargement. */
    public String resolveOriginalFileName(MultipartFile file) {
        String original = file.getOriginalFilename();
        return original != null && !original.isBlank()
                ? StringUtils.cleanPath(original)
                : "document.pdf";
    }

    public Resource load(String storedName) {

        if (storedName == null || storedName.isBlank()) {
            throw new RuntimeException("Fichier PDF introuvable pour ce conseil.");
        }

        Path target = uploadDir.resolve(storedName).normalize();

        if (!target.startsWith(uploadDir) || !Files.exists(target)) {
            throw new RuntimeException("Fichier PDF introuvable pour ce conseil.");
        }

        return new FileSystemResource(target);
    }

    /** Suppression silencieuse (aucune erreur si le fichier n'existe déjà plus). */
    public void delete(String storedName) {

        if (storedName == null || storedName.isBlank()) {
            return;
        }

        try {
            Path target = uploadDir.resolve(storedName).normalize();
            if (target.startsWith(uploadDir)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException ignored) {
            // Suppression best-effort : ne doit jamais faire échouer une opération métier.
        }
    }

    private void validate(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new PdfValidationException("Le fichier PDF est obligatoire.");
        }

        if (file.getSize() > maxSizeBytes) {
            throw new PdfValidationException(
                    "Le fichier PDF ne doit pas dépasser " + maxSizeMb + " Mo."
            );
        }

        String original = file.getOriginalFilename();
        boolean hasPdfExtension = original != null
                && original.toLowerCase(Locale.ROOT).endsWith(".pdf");

        if (!hasPdfExtension) {
            throw new PdfValidationException("Seuls les fichiers PDF (.pdf) sont autorisés.");
        }

        String contentType = file.getContentType();
        boolean hasPdfMimeType = contentType != null
                && contentType.equalsIgnoreCase("application/pdf");

        if (!hasPdfMimeType) {
            throw new PdfValidationException("Seuls les fichiers PDF sont autorisés.");
        }

        if (!hasPdfSignature(file)) {
            throw new PdfValidationException("Le fichier sélectionné n'est pas un PDF valide.");
        }
    }

    /**
     * Vérifie la signature binaire réelle du fichier (les 5 premiers octets
     * doivent être "%PDF-") plutôt que de se fier uniquement à l'extension ou
     * au Content-Type déclaré par le navigateur, qui peuvent être falsifiés.
     */
    private boolean hasPdfSignature(MultipartFile file) {

        byte[] header = new byte[PDF_SIGNATURE.length];

        try (InputStream in = file.getInputStream()) {
            int read = in.read(header);
            return read == PDF_SIGNATURE.length && Arrays.equals(header, PDF_SIGNATURE);
        } catch (IOException e) {
            throw new PdfValidationException("Impossible de lire le fichier envoyé.");
        }
    }
}