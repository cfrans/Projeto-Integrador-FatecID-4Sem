package com.nemo.api.simulacao;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoints da caixa de entrada simulada (Plano B offline da apresentação).
 */
@RestController
@RequestMapping("/api/simulacao")
@RequiredArgsConstructor
public class SimulacaoController {

    private final SimulacaoService simulacaoService;

    @GetMapping("/campanhas/{id}/inbox")
    public ResponseEntity<List<InboxEmailDTO>> inbox(@PathVariable Integer id) {
        return ResponseEntity.ok(simulacaoService.listarInbox(id));
    }
}
