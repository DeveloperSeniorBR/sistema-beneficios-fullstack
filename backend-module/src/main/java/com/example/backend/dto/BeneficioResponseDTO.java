package com.example.backend.dto;

import com.example.backend.entity.Beneficio;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para resposta de Beneficio
 */
public class BeneficioResponseDTO {

    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal valor;
    private Boolean ativo;
    private Long version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Construtores
    public BeneficioResponseDTO() {
    }

    public BeneficioResponseDTO(Beneficio beneficio) {
        this.id = beneficio.getId();
        this.nome = beneficio.getNome();
        this.descricao = beneficio.getDescricao();
        this.valor = beneficio.getValor();
        this.ativo = beneficio.getAtivo();
        this.version = beneficio.getVersion();
        this.createdAt = beneficio.getCreatedAt();
        this.updatedAt = beneficio.getUpdatedAt();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
