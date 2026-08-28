package com.Stage.Dalil_sante.exception;

/**
 * Levée lorsqu'un fichier envoyé pour un conseil de santé n'est pas un PDF
 * valide (extension, type MIME réel, signature binaire, ou taille). Toujours
 * traduite en HTTP 400 par GlobalExceptionHandler, quel que soit le message.
 */
public class PdfValidationException extends RuntimeException {

    public PdfValidationException(String message) {
        super(message);
    }
}