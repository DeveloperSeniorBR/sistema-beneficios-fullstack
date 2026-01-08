package com.example.backend.service;

import com.example.backend.dto.BeneficioRequestDTO;
import com.example.backend.dto.BeneficioResponseDTO;
import com.example.backend.dto.TransferenciaRequestDTO;
import com.example.backend.entity.Beneficio;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.BeneficioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes unitários para BeneficioService
 */
@ExtendWith(MockitoExtension.class)
class BeneficioServiceTest {

    @Mock
    private BeneficioRepository repository;

    @InjectMocks
    private BeneficioService service;

    private Beneficio beneficio1;
    private Beneficio beneficio2;

    @BeforeEach
    void setUp() {
        beneficio1 = new Beneficio("Beneficio A", "Descrição A", new BigDecimal("1000.00"));
        beneficio1.setId(1L);
        beneficio1.setAtivo(true);

        beneficio2 = new Beneficio("Beneficio B", "Descrição B", new BigDecimal("500.00"));
        beneficio2.setId(2L);
        beneficio2.setAtivo(true);
    }

    @Test
    void testFindAll() {
        when(repository.findAll()).thenReturn(Arrays.asList(beneficio1, beneficio2));

        List<BeneficioResponseDTO> result = service.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void testFindById_Success() {
        when(repository.findById(1L)).thenReturn(Optional.of(beneficio1));

        BeneficioResponseDTO result = service.findById(1L);

        assertNotNull(result);
        assertEquals("Beneficio A", result.getNome());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findById(999L));
        verify(repository, times(1)).findById(999L);
    }

    @Test
    void testCreate() {
        BeneficioRequestDTO dto = new BeneficioRequestDTO();
        dto.setNome("Novo Beneficio");
        dto.setDescricao("Nova Descrição");
        dto.setValor(new BigDecimal("200.00"));

        when(repository.save(any(Beneficio.class))).thenReturn(beneficio1);

        BeneficioResponseDTO result = service.create(dto);

        assertNotNull(result);
        verify(repository, times(1)).save(any(Beneficio.class));
    }

    @Test
    void testUpdate_Success() {
        BeneficioRequestDTO dto = new BeneficioRequestDTO();
        dto.setNome("Beneficio Atualizado");
        dto.setDescricao("Descrição Atualizada");
        dto.setValor(new BigDecimal("1500.00"));

        when(repository.findById(1L)).thenReturn(Optional.of(beneficio1));
        when(repository.save(any(Beneficio.class))).thenReturn(beneficio1);

        BeneficioResponseDTO result = service.update(1L, dto);

        assertNotNull(result);
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(any(Beneficio.class));
    }

    @Test
    void testDelete() {
        when(repository.findById(1L)).thenReturn(Optional.of(beneficio1));
        when(repository.save(any(Beneficio.class))).thenReturn(beneficio1);

        service.delete(1L);

        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(any(Beneficio.class));
    }

    @Test
    void testTransferir_Success() {
        TransferenciaRequestDTO dto = new TransferenciaRequestDTO(1L, 2L, new BigDecimal("100.00"));

        when(repository.findById(1L)).thenReturn(Optional.of(beneficio1));
        when(repository.findById(2L)).thenReturn(Optional.of(beneficio2));
        when(repository.save(any(Beneficio.class))).thenAnswer(i -> i.getArguments()[0]);

        service.transferir(dto);

        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).findById(2L);
        verify(repository, times(2)).save(any(Beneficio.class));
    }

    @Test
    void testTransferir_SaldoInsuficiente() {
        TransferenciaRequestDTO dto = new TransferenciaRequestDTO(1L, 2L, new BigDecimal("2000.00"));

        when(repository.findById(1L)).thenReturn(Optional.of(beneficio1));
        when(repository.findById(2L)).thenReturn(Optional.of(beneficio2));

        assertThrows(BusinessException.class, () -> service.transferir(dto));
    }

    @Test
    void testTransferir_MesmoBeneficio() {
        TransferenciaRequestDTO dto = new TransferenciaRequestDTO(1L, 1L, new BigDecimal("100.00"));

        assertThrows(BusinessException.class, () -> service.transferir(dto));
    }

    @Test
    void testTransferir_BeneficioInativo() {
        beneficio1.setAtivo(false);
        TransferenciaRequestDTO dto = new TransferenciaRequestDTO(1L, 2L, new BigDecimal("100.00"));

        when(repository.findById(1L)).thenReturn(Optional.of(beneficio1));
        when(repository.findById(2L)).thenReturn(Optional.of(beneficio2));

        assertThrows(BusinessException.class, () -> service.transferir(dto));
    }
}
