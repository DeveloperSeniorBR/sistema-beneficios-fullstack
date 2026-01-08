package com.example.backend;

import com.example.backend.dto.BeneficioRequestDTO;
import com.example.backend.dto.BeneficioResponseDTO;
import com.example.backend.dto.TransferenciaRequestDTO;
import com.example.backend.service.BeneficioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para operações CRUD de Beneficio
 */
@RestController
@RequestMapping("/api/v1/beneficios")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Benefícios", description = "API para gerenciamento de benefícios")
public class BeneficioController {

    private final BeneficioService service;

    public BeneficioController(BeneficioService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar todos os benefícios", description = "Retorna lista de todos os benefícios cadastrados")
    public ResponseEntity<List<BeneficioResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/ativos")
    @Operation(summary = "Listar benefícios ativos", description = "Retorna apenas benefícios com status ativo")
    public ResponseEntity<List<BeneficioResponseDTO>> findAllAtivos() {
        return ResponseEntity.ok(service.findAllAtivos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar benefício por ID", description = "Retorna um benefício específico pelo ID")
    public ResponseEntity<BeneficioResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @Operation(summary = "Criar novo benefício", description = "Cria um novo benefício no sistema")
    public ResponseEntity<BeneficioResponseDTO> create(@Valid @RequestBody BeneficioRequestDTO dto) {
        BeneficioResponseDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar benefício", description = "Atualiza dados de um benefício existente")
    public ResponseEntity<BeneficioResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody BeneficioRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar benefício", description = "Desativa um benefício (soft delete)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/transferir")
    @Operation(summary = "Transferir valor entre benefícios",
            description = "Realiza transferência de valor entre dois benefícios com validações")
    public ResponseEntity<Void> transferir(@Valid @RequestBody TransferenciaRequestDTO dto) {
        service.transferir(dto);
        return ResponseEntity.ok().build();
    }
}
