package com.nemo.api.treinamento;

import com.nemo.api.model.dto.TreinamentoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/treinamentos")
@RequiredArgsConstructor
public class TreinamentoController {

    private final TreinamentoService treinamentoService;

    @GetMapping
    public ResponseEntity<List<TreinamentoDTO>> listarTreinamentos(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(treinamentoService.listarTreinamentosComStatus(authHeader.replace("Bearer ", "")));
    }

    @PostMapping("/{id}/concluir")
    public ResponseEntity<Void> concluirTreinamento(@PathVariable Integer id, @RequestHeader("Authorization") String authHeader) {
        treinamentoService.concluirTreinamento(id, authHeader.replace("Bearer ", ""));
        return ResponseEntity.noContent().build();
    }
}
