package com.example.ejb.exception;

import jakarta.ejb.ApplicationException;
import java.math.BigDecimal;

/**
 * Exceção lançada quando há tentativa de transferência com saldo insuficiente
 */
@ApplicationException(rollback = true)
public class SaldoInsuficienteException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public SaldoInsuficienteException(String message) {
        super(message);
    }

    public SaldoInsuficienteException(Long beneficioId, BigDecimal saldoAtual, BigDecimal valorNecessario) {
        super(String.format("Saldo insuficiente no benefício ID %d. Saldo atual: %.2f, Valor necessário: %.2f",
                beneficioId, saldoAtual, valorNecessario));
    }
}
