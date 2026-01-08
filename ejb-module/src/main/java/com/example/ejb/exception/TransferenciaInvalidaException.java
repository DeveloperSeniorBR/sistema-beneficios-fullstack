package com.example.ejb.exception;

import jakarta.ejb.ApplicationException;

/**
 * Exceção lançada quando uma transferência é inválida
 */
@ApplicationException(rollback = true)
public class TransferenciaInvalidaException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public TransferenciaInvalidaException(String message) {
        super(message);
    }
}
