package com.example.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * DTO para requisição de transferência entre benefícios
 */
public class TransferenciaRequestDTO {

    @NotNull(message = "ID de origem não pode ser nulo")
    private Long deId;

    @NotNull(message = "ID de destino não pode ser nulo")
    private Long paraId;

    @NotNull(message = "Valor não pode ser nulo")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    // Construtores
    public TransferenciaRequestDTO() {
    }

    public TransferenciaRequestDTO(Long deId, Long paraId, BigDecimal valor) {
        this.deId = deId;
        this.paraId = paraId;
        this.valor = valor;
    }

    // Getters e Setters
    public Long getDeId() {
        return deId;
    }

    public void setDeId(Long deId) {
        this.deId = deId;
    }

    public Long getParaId() {
        return paraId;
    }

    public void setParaId(Long paraId) {
        this.paraId = paraId;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}
