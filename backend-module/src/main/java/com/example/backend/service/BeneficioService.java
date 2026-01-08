package com.example.backend.service;

import com.example.backend.dto.BeneficioRequestDTO;
import com.example.backend.dto.BeneficioResponseDTO;
import com.example.backend.dto.TransferenciaRequestDTO;
import com.example.backend.entity.Beneficio;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.BeneficioRepository;
import jakarta.persistence.OptimisticLockException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço de negócio para Beneficio
 * Este serviço implementa lógica local e pode integrar com EJB se necessário
 */
@Service
@Transactional
public class BeneficioService {

    private static final Logger logger = LoggerFactory.getLogger(BeneficioService.class);

    private final BeneficioRepository repository;

    public BeneficioService(BeneficioRepository repository) {
        this.repository = repository;
    }

    /**
     * Lista todos os benefícios
     */
    @Transactional(readOnly = true)
    public List<BeneficioResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(BeneficioResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Lista benefícios ativos
     */
    @Transactional(readOnly = true)
    public List<BeneficioResponseDTO> findAllAtivos() {
        return repository.findByAtivoTrue().stream()
                .map(BeneficioResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Busca benefício por ID
     */
    @Transactional(readOnly = true)
    public BeneficioResponseDTO findById(Long id) {
        Beneficio beneficio = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficio", id));
        return new BeneficioResponseDTO(beneficio);
    }

    /**
     * Cria novo benefício
     */
    public BeneficioResponseDTO create(BeneficioRequestDTO dto) {
        Beneficio beneficio = new Beneficio();
        beneficio.setNome(dto.getNome());
        beneficio.setDescricao(dto.getDescricao());
        beneficio.setValor(dto.getValor());
        beneficio.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);

        Beneficio saved = repository.save(beneficio);
        logger.info("Benefício criado: ID={}, Nome={}", saved.getId(), saved.getNome());
        return new BeneficioResponseDTO(saved);
    }

    /**
     * Atualiza benefício existente
     */
    public BeneficioResponseDTO update(Long id, BeneficioRequestDTO dto) {
        Beneficio beneficio = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficio", id));

        beneficio.setNome(dto.getNome());
        beneficio.setDescricao(dto.getDescricao());
        beneficio.setValor(dto.getValor());
        if (dto.getAtivo() != null) {
            beneficio.setAtivo(dto.getAtivo());
        }

        try {
            Beneficio updated = repository.save(beneficio);
            logger.info("Benefício atualizado: ID={}", updated.getId());
            return new BeneficioResponseDTO(updated);
        } catch (OptimisticLockException e) {
            throw new BusinessException("O benefício foi modificado por outro usuário. Recarregue e tente novamente.", e);
        }
    }

    /**
     * Deleta (desativa) benefício
     */
    public void delete(Long id) {
        Beneficio beneficio = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficio", id));

        beneficio.setAtivo(false);
        repository.save(beneficio);
        logger.info("Benefício desativado: ID={}", id);
    }

    /**
     * Transfere valor entre benefícios - implementação local
     * Usa transação do Spring com optimistic locking
     */
    public void transferir(TransferenciaRequestDTO dto) {
        // Validações básicas
        if (dto.getDeId().equals(dto.getParaId())) {
            throw new BusinessException("Não é possível transferir para o mesmo benefício");
        }

        if (dto.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Valor da transferência deve ser positivo");
        }

        // Busca benefícios
        Beneficio origem = repository.findById(dto.getDeId())
                .orElseThrow(() -> new ResourceNotFoundException("Beneficio de origem", dto.getDeId()));

        Beneficio destino = repository.findById(dto.getParaId())
                .orElseThrow(() -> new ResourceNotFoundException("Beneficio de destino", dto.getParaId()));

        // Validações de negócio
        if (!Boolean.TRUE.equals(origem.getAtivo())) {
            throw new BusinessException("Benefício de origem está inativo");
        }

        if (!Boolean.TRUE.equals(destino.getAtivo())) {
            throw new BusinessException("Benefício de destino está inativo");
        }

        if (origem.getValor().compareTo(dto.getValor()) < 0) {
            throw new BusinessException(
                    String.format("Saldo insuficiente. Saldo atual: %.2f, Valor solicitado: %.2f",
                            origem.getValor(), dto.getValor())
            );
        }

        // Realiza transferência
        origem.setValor(origem.getValor().subtract(dto.getValor()));
        destino.setValor(destino.getValor().add(dto.getValor()));

        try {
            repository.save(origem);
            repository.save(destino);
            logger.info("Transferência realizada: De={} Para={} Valor={}",
                    dto.getDeId(), dto.getParaId(), dto.getValor());
        } catch (OptimisticLockException e) {
            throw new BusinessException(
                    "Conflito de concorrência: os benefícios foram modificados. Tente novamente.", e);
        }
    }
}
