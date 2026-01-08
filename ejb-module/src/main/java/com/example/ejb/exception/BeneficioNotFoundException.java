package com.example.ejb.exception;

import jakarta.ejb.ApplicationException;

/**
 * Exceção lançada quando um benefício não é encontrado
 */
@ApplicationException(rollback = true)
public class BeneficioNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public BeneficioNotFoundException(String message) {
        super(message);
    }

    public BeneficioNotFoundException(Long id) {
        super("Benefício com ID " + id + " não encontrado");
    }
}
