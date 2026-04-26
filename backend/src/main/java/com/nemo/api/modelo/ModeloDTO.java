package com.nemo.api.modelo;

import java.time.LocalDateTime;

public record ModeloDTO(
        Integer idModelo,
        String nomeModelo,
        String dominioAlvo,
        String remetenteFalso,
        String assuntoPadrao,
        LocalDateTime data,
        String textoHtml
) {}