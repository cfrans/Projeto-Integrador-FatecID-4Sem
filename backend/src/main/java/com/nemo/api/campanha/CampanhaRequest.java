package com.nemo.api.campanha;

import java.util.List;

public record CampanhaRequest(
        String nomeCampanha,
        String assuntoEmail,
        String nomeAnexo,
        Integer idModelo,
        List<Integer> idSetores
) {}