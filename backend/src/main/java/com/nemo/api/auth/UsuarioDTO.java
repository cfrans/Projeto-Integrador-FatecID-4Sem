package com.nemo.api.auth;

public record UsuarioDTO(
        Integer id,
        String nome,
        String email,
        String tipoAcesso,
        byte[] foto
) { }
