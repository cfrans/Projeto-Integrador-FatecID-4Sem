package com.nemo.api.usuario;

public record UsuarioDestinoRequest(
        Integer matricula,
        String nome,
        String email,
        Integer idSetor
) {}