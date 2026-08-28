package com.Stage.Dalil_sante.exception;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Gestion centralisée des exceptions pour toute l'API.
 *
 * L'application ne définit aucune hiérarchie d'exceptions métier propre :
 * tous les services lèvent des {@link RuntimeException} génériques avec un
 * message en français ("... introuvable", "... existe déjà", "mot de passe
 * incorrect", etc.). Pour ne pas toucher à la logique métier existante, ce
 * handler classe ces exceptions par mot-clé de message afin de renvoyer le
 * code HTTP le plus pertinent (400/401/404/409), et ne renvoie 500 que
 * lorsque l'erreur n'est pas reconnue comme une erreur métier connue.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @Value("${app.upload.max-pdf-size-mb:10}")
    private int maxPdfSizeMb;

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiError> handleEntityNotFound(
            EntityNotFoundException ex,
            HttpServletRequest request
    ) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request
    ) {
        return build(
                HttpStatus.FORBIDDEN,
                "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
                request
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            HttpServletRequest request
    ) {
        return build(
                HttpStatus.CONFLICT,
                "Cette opération viole une contrainte d'intégrité des données (doublon ou référence encore utilisée).",
                request
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError ->
                        fieldError.getField() + " : " + fieldError.getDefaultMessage()
                )
                .collect(Collectors.joining(" ; "));

        if (message.isBlank()) {
            message = "Requête invalide.";
        }

        return build(HttpStatus.BAD_REQUEST, message, request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadableBody(
            HttpMessageNotReadableException ex,
            HttpServletRequest request
    ) {
        return build(
                HttpStatus.BAD_REQUEST,
                "Corps de la requête invalide ou illisible.",
                request
        );
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiError> handleMissingParameter(
            MissingServletRequestParameterException ex,
            HttpServletRequest request
    ) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex,
            HttpServletRequest request
    ) {
        return build(
                HttpStatus.BAD_REQUEST,
                "Paramètre invalide : " + ex.getName(),
                request
        );
    }

    /** Fichier PDF invalide (obligatoire, type/signature incorrecte, ou lecture impossible) - toujours 400. */
    @ExceptionHandler(PdfValidationException.class)
    public ResponseEntity<ApiError> handlePdfValidation(
            PdfValidationException ex,
            HttpServletRequest request
    ) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    /**
     * Fichier envoyé plus volumineux que la limite technique multipart
     * (spring.servlet.multipart.max-file-size, alignée sur la même valeur
     * configurable que la validation métier PdfStorageService).
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiError> handleMaxUploadSize(
            MaxUploadSizeExceededException ex,
            HttpServletRequest request
    ) {
        return build(
                HttpStatus.BAD_REQUEST,
                "Le fichier PDF ne doit pas dépasser " + maxPdfSizeMb + " Mo.",
                request
        );
    }

    /** Partie multipart obligatoire manquante (ex. "pdf" absent d'un formulaire de création). */
    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ApiError> handleMissingPart(
            MissingServletRequestPartException ex,
            HttpServletRequest request
    ) {
        return build(
                HttpStatus.BAD_REQUEST,
                "Le fichier PDF est obligatoire.",
                request
        );
    }

    /**
     * Toutes les exceptions métier de l'application (voir services/*) sont des
     * RuntimeException brutes. On les classe par mot-clé de message.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntimeException(
            RuntimeException ex,
            HttpServletRequest request
    ) {

        String message = ex.getMessage();

        if (message == null || message.isBlank()) {
            return build(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Une erreur interne est survenue.",
                    request
            );
        }

        return build(classify(message), message, request);
    }

    /**
     * Filet de sécurité final pour toute exception non couverte ci-dessus
     * (erreurs réellement inattendues) : reste en 500.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(
            Exception ex,
            HttpServletRequest request
    ) {
        return build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Une erreur interne est survenue.",
                request
        );
    }

    private HttpStatus classify(String message) {

        String normalized = message.toLowerCase();

        if (normalized.contains("introuvable")) {
            return HttpStatus.NOT_FOUND;
        }

        if (normalized.contains("existe déjà")
                || normalized.contains("déjà utilisé")
                || normalized.contains("possède déjà")) {
            return HttpStatus.CONFLICT;
        }

        if (normalized.contains("incorrect")
                || normalized.contains("désactivé")) {
            return HttpStatus.UNAUTHORIZED;
        }

        if (normalized.contains("obligatoires")
                || normalized.contains("24h/24")
                || normalized.contains("confirmation du mot de passe")
                || normalized.contains("différent de l'ancien")) {
            return HttpStatus.BAD_REQUEST;
        }

        // Message métier non reconnu : on ne prend pas le risque de le
        // présenter comme une erreur "client" -> 500 par défaut.
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private ResponseEntity<ApiError> build(
            HttpStatus status,
            String message,
            HttpServletRequest request
    ) {

        ApiError error = new ApiError(
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(error);
    }
}
