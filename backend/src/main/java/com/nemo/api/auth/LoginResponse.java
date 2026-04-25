package com.nemo.api.auth;

public record LoginResponse(String token, String nome, String role, boolean primeiroAcesso) {}