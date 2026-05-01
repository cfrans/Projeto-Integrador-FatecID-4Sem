package com.nemo.api.usuario;

public record UsuarioDestinoDTO(
        Integer idUsuarioDestino,
        Integer matricula,
        String nome,
        String email,
        Integer pontuacao,
        Integer idSetor,
        String nomeSetor
) {}