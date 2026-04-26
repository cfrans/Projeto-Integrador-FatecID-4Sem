package com.nemo.api.campanha;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campanhas")
@RequiredArgsConstructor
public class CampanhaController {

    private final CampanhaService campanhaService;

    @GetMapping
    public ResponseEntity<List<CampanhaDTO>> listar() {
        return ResponseEntity.ok(campanhaService.listar());
    }

    @PostMapping
    public ResponseEntity<CampanhaDTO> criar(
            @RequestBody CampanhaRequest request,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(campanhaService.criar(request, authHeader.replace("Bearer ", "")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        campanhaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}