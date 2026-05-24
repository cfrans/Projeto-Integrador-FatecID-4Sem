package com.nemo.api.colaborador;

import com.nemo.api.auth.JwtService;
import com.nemo.api.config.exception.ResourceNotFoundException;
import com.nemo.api.repository.PontuacaoEventoRepository;
import com.nemo.api.repository.UsuarioDestinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colaborador")
@RequiredArgsConstructor
public class ColaboradorController {

    private final UsuarioDestinoRepository usuarioDestinoRepository;
    private final PontuacaoEventoRepository pontuacaoEventoRepository;
    private final JwtService jwtService;

    /**
     * Retorna o saldo atual e o histórico de eventos de pontuação do colaborador logado.
     * Identificação feita pelo email extraído do JWT.
     */
    @GetMapping("/pontuacao")
    public ResponseEntity<PontuacaoDTO> getPontuacao(
            @RequestHeader("Authorization") String authHeader) {

        String email = jwtService.extractEmail(authHeader.replace("Bearer ", ""));

        var usuario = usuarioDestinoRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Colaborador não encontrado"));

        int saldo = usuario.getPontuacao() != null ? usuario.getPontuacao() : 500;

        List<PontuacaoDTO.EventoDTO> historico =
                pontuacaoEventoRepository
                        .findByUsuarioDestino_IdUsuarioDestinoOrderByCriadoEmDesc(
                                usuario.getIdUsuarioDestino())
                        .stream()
                        .map(e -> new PontuacaoDTO.EventoDTO(
                                e.getTipoEvento().name(),
                                e.getDelta(),
                                e.getSaldoApos(),
                                e.getCriadoEm()))
                        .toList();

        return ResponseEntity.ok(new PontuacaoDTO(saldo, historico));
    }
}
