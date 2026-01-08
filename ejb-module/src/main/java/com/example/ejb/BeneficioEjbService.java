package com.example.ejb;

import com.example.ejb.exception.*;
import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

/**
 * Serviço EJB para gerenciar benefícios com correção de bugs:
 * - Validações de entrada e regras de negócio
 * - Optimistic locking para prevenir lost updates
 * - Tratamento adequado de exceções com rollback
 * - CRUD completo
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.REQUIRED)
public class BeneficioEjbService {

    @PersistenceContext(unitName = "beneficioPU")
    private EntityManager em;

    /**
     * Cria um novo benefício
     */
    public Beneficio create(@Valid @NotNull Beneficio beneficio) {
        if (beneficio.getId() != null) {
            throw new IllegalArgumentException("Benefício novo não deve ter ID");
        }
        em.persist(beneficio);
        em.flush();
        return beneficio;
    }

    /**
     * Busca benefício por ID
     */
    public Beneficio findById(@NotNull Long id) {
        Beneficio beneficio = em.find(Beneficio.class, id);
        if (beneficio == null) {
            throw new BeneficioNotFoundException(id);
        }
        return beneficio;
    }

    /**
     * Lista todos os benefícios
     */
    public List<Beneficio> findAll() {
        return em.createQuery("SELECT b FROM Beneficio b ORDER BY b.id", Beneficio.class)
                .getResultList();
    }

    /**
     * Lista benefícios ativos
     */
    public List<Beneficio> findAllAtivos() {
        return em.createQuery("SELECT b FROM Beneficio b WHERE b.ativo = true ORDER BY b.id", Beneficio.class)
                .getResultList();
    }

    /**
     * Atualiza um benefício existente
     */
    public Beneficio update(@Valid @NotNull Beneficio beneficio) {
        if (beneficio.getId() == null) {
            throw new IllegalArgumentException("Benefício deve ter ID para atualização");
        }

        // Verifica se existe
        Beneficio existing = findById(beneficio.getId());

        // Merge vai usar optimistic locking automaticamente via @Version
        try {
            return em.merge(beneficio);
        } catch (OptimisticLockException e) {
            throw new RuntimeException("Conflito de concorrência: o benefício foi modificado por outra transação", e);
        }
    }

    /**
     * Deleta (desativa) um benefício
     */
    public void delete(@NotNull Long id) {
        Beneficio beneficio = findById(id);
        beneficio.setAtivo(false);
        em.merge(beneficio);
    }

    /**
     * Transfere valor entre benefícios - CORREÇÃO DO BUG PRINCIPAL
     *
     * Correções implementadas:
     * 1. Validação de entrada (IDs válidos, valor positivo)
     * 2. Verificação de existência dos benefícios
     * 3. Verificação se benefícios estão ativos
     * 4. Validação de saldo suficiente
     * 5. Optimistic locking via @Version para prevenir lost updates
     * 6. Rollback automático em caso de erro via @ApplicationException
     */
    public void transfer(@NotNull Long fromId, @NotNull Long toId, @NotNull BigDecimal amount) {
        // Validação 1: Parâmetros básicos
        if (fromId == null || toId == null || amount == null) {
            throw new TransferenciaInvalidaException("IDs e valor não podem ser nulos");
        }

        if (fromId.equals(toId)) {
            throw new TransferenciaInvalidaException("Não é possível transferir para o mesmo benefício");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new TransferenciaInvalidaException("Valor da transferência deve ser positivo");
        }

        // Busca os benefícios com lock otimista
        Beneficio from = findById(fromId);
        Beneficio to = findById(toId);

        // Validação 2: Benefícios devem estar ativos
        if (!Boolean.TRUE.equals(from.getAtivo())) {
            throw new BeneficioInativoException(fromId);
        }

        if (!Boolean.TRUE.equals(to.getAtivo())) {
            throw new BeneficioInativoException(toId);
        }

        // Validação 3: Saldo suficiente
        if (from.getValor().compareTo(amount) < 0) {
            throw new SaldoInsuficienteException(fromId, from.getValor(), amount);
        }

        // Realiza a transferência
        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));

        // Merge com optimistic locking - se houver conflito, OptimisticLockException será lançada
        try {
            em.merge(from);
            em.merge(to);
            em.flush(); // Força a sincronização com o banco
        } catch (OptimisticLockException e) {
            throw new RuntimeException(
                "Conflito de concorrência durante transferência: os benefícios foram modificados por outra transação. " +
                "Por favor, tente novamente.", e);
        }
    }
}
