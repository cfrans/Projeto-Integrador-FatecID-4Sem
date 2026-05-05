package com.nemo.api.usuario;

import java.time.LocalDateTime;

public record UsuarioDestinoDTO(
        Integer idUsuarioDestino,
        Integer matricula,
        String nome,
        String email,
        Integer pontuacao,
        Integer idSetor,
        String nomeSetor,
        Boolean primeiroAcesso,
        LocalDateTime ultimoLogin
) {}