package com.nemo.api.auth;

import java.time.LocalDateTime;

public record UsuarioDTO(
        String id,
        String nome,
        String email,
        String tipoAcesso,
        byte[] foto,
        Boolean primeiroAcesso,
        LocalDateTime ultimoLogin
) { }
