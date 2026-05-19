package com.nemo.api.auth;

public record PerguntasSegurancaRequest(
        Integer idPergunta1,
        String resposta1,
        Integer idPergunta2,
        String resposta2
) {}
