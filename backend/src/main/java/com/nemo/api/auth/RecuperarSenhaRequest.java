package com.nemo.api.auth;

public record RecuperarSenhaRequest(
    String email,
    String resposta1,
    String resposta2,
    String novaSenha
) {}
