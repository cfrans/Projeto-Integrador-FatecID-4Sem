package com.nemo.api.auth;

public record AlterarRoleRequest(
        Integer idUsuario,
        Integer idTipoAcesso
) { }
