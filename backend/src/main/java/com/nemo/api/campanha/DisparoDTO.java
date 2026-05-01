package com.nemo.api.campanha;

import java.time.LocalDateTime;

public record DisparoDTO(
        Integer idDisparo,
        String nomeDestinatario,
        String emailDestinatario,
        String setor,
        Integer pontuacao,
        Boolean clicouLink,
        Boolean abriuAnexo,
        Boolean reportouPhishing,
        LocalDateTime dataEnvio
) {}