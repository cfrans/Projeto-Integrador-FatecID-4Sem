package com.nemo.api.colaborador;

import java.time.LocalDateTime;
import java.util.List;

public record PontuacaoDTO(
        Integer saldoAtual,
        List<EventoDTO> historico
) {
    public record EventoDTO(
            String tipoEvento,
            Integer delta,
            Integer saldoApos,
            LocalDateTime criadoEm
    ) {}
}
