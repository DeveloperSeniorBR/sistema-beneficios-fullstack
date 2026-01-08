package com.example.ejb.exception;

import jakarta.ejb.ApplicationException;

/**
 * Exceção lançada quando se tenta operar com um benefício inativo
 */
@ApplicationException(rollback = true)
public class BeneficioInativoException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public BeneficioInativoException(String message) {
        super(message);
    }

    public BeneficioInativoException(Long id) {
        super("Benefício com ID " + id + " está inativo");
    }
}
