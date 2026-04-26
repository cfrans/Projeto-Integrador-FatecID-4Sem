package com.nemo.api.modelo;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modelos")
@RequiredArgsConstructor
public class ModeloController {

    private final ModeloService modeloService;

    @GetMapping
    public ResponseEntity<List<ModeloDTO>> listar() {
        return ResponseEntity.ok(modeloService.listar());
    }

    @PostMapping
    public ResponseEntity<ModeloDTO> criar(
            @RequestBody ModeloRequest request,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(modeloService.criar(request, authHeader.replace("Bearer ", "")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModeloDTO> atualizar(
            @PathVariable Integer id,
            @RequestBody ModeloRequest request) {
        return ResponseEntity.ok(modeloService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        modeloService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}