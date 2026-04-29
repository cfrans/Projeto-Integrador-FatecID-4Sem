package com.nemo.api.auth;

public record AtualizarPerfilRequest(
        String nome,
        String email
) { }
