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

    @GetMapping("/{id}/disparos")
    public ResponseEntity<List<DisparoDTO>> listarDisparos(
            @PathVariable Integer id,
            @RequestParam(required = false) Boolean clicouLink,
            @RequestParam(required = false) Boolean abriuAnexo,
            @RequestParam(required = false) Boolean reportouPhishing) {
        return ResponseEntity.ok(
                campanhaService.listarDisparos(id, clicouLink, abriuAnexo, reportouPhishing)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        campanhaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/teste-worker")
    public ResponseEntity<String> testeWorker() {
        try {
            String resultado = campanhaService.testarWorkerC();
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro no Java: " + e.getMessage());
        }
    }
}