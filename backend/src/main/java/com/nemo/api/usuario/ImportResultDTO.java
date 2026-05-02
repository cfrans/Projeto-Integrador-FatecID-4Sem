package com.nemo.api.usuario;

import java.util.List;

public record ImportResultDTO(
        int total,
        int criados,
        int ignorados,
        List<String> erros
) {}
