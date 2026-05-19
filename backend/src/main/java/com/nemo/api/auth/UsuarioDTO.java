package com.nemo.api.auth;

import java.time.LocalDateTime;

public record UsuarioDTO(
        String id,
        String nome,
        String email,
        String tipoAcesso,
        Boolean primeiroAcesso,
        LocalDateTime ultimoLogin
) { }
