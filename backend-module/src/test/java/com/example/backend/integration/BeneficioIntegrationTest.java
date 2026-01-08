package com.example.backend.integration;

import com.example.backend.dto.BeneficioRequestDTO;
import com.example.backend.dto.BeneficioResponseDTO;
import com.example.backend.dto.TransferenciaRequestDTO;
import com.example.backend.entity.Beneficio;
import com.example.backend.repository.BeneficioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testes de integração para endpoints de Beneficio
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class BeneficioIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BeneficioRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    private Beneficio beneficio1;
    private Beneficio beneficio2;

    @BeforeEach
    void setUp() {
        repository.deleteAll();

        beneficio1 = new Beneficio("Beneficio Teste A", "Descrição A", new BigDecimal("1000.00"));
        beneficio1 = repository.save(beneficio1);

        beneficio2 = new Beneficio("Beneficio Teste B", "Descrição B", new BigDecimal("500.00"));
        beneficio2 = repository.save(beneficio2);
    }

    @Test
    void testFindAll() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].nome", is("Beneficio Teste A")))
                .andExpect(jsonPath("$[1].nome", is("Beneficio Teste B")));
    }

    @Test
    void testFindById() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios/{id}", beneficio1.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome", is("Beneficio Teste A")))
                .andExpect(jsonPath("$.valor", is(1000.00)));
    }

    @Test
    void testFindById_NotFound() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreate() throws Exception {
        BeneficioRequestDTO dto = new BeneficioRequestDTO();
        dto.setNome("Novo Beneficio");
        dto.setDescricao("Nova Descrição");
        dto.setValor(new BigDecimal("300.00"));

        mockMvc.perform(post("/api/v1/beneficios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome", is("Novo Beneficio")))
                .andExpect(jsonPath("$.valor", is(300.00)));
    }

    @Test
    void testCreate_ValidationError() throws Exception {
        BeneficioRequestDTO dto = new BeneficioRequestDTO();
        dto.setNome(""); // Nome vazio deve falhar
        dto.setValor(new BigDecimal("100.00"));

        mockMvc.perform(post("/api/v1/beneficios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdate() throws Exception {
        BeneficioRequestDTO dto = new BeneficioRequestDTO();
        dto.setNome("Beneficio Atualizado");
        dto.setDescricao("Descrição Atualizada");
        dto.setValor(new BigDecimal("1500.00"));

        mockMvc.perform(put("/api/v1/beneficios/{id}", beneficio1.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome", is("Beneficio Atualizado")))
                .andExpect(jsonPath("$.valor", is(1500.00)));
    }

    @Test
    void testDelete() throws Exception {
        mockMvc.perform(delete("/api/v1/beneficios/{id}", beneficio1.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/beneficios/{id}", beneficio1.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo", is(false)));
    }

    @Test
    void testTransferir_Success() throws Exception {
        TransferenciaRequestDTO dto = new TransferenciaRequestDTO(
                beneficio1.getId(),
                beneficio2.getId(),
                new BigDecimal("200.00")
        );

        mockMvc.perform(post("/api/v1/beneficios/transferir")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        // Verifica saldos atualizados
        mockMvc.perform(get("/api/v1/beneficios/{id}", beneficio1.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valor", is(800.00)));

        mockMvc.perform(get("/api/v1/beneficios/{id}", beneficio2.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valor", is(700.00)));
    }

    @Test
    void testTransferir_SaldoInsuficiente() throws Exception {
        TransferenciaRequestDTO dto = new TransferenciaRequestDTO(
                beneficio1.getId(),
                beneficio2.getId(),
                new BigDecimal("2000.00") // Maior que o saldo disponível
        );

        mockMvc.perform(post("/api/v1/beneficios/transferir")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Saldo insuficiente")));
    }

    @Test
    void testTransferir_MesmoBeneficio() throws Exception {
        TransferenciaRequestDTO dto = new TransferenciaRequestDTO(
                beneficio1.getId(),
                beneficio1.getId(),
                new BigDecimal("100.00")
        );

        mockMvc.perform(post("/api/v1/beneficios/transferir")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }
}
