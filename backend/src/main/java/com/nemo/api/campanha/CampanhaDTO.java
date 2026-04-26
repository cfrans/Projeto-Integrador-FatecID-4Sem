package com.nemo.api.campanha;

import java.time.LocalDateTime;
import java.util.List;

public record CampanhaDTO(
        Integer idCampanha,
        String nomeCampanha,
        String assuntoEmail,
        String nomeAnexo,
        String statusEnvio,
        LocalDateTime dataCriacao,
        Integer idModelo,
        String nomeModelo,
        String dominioAlvo,
        String textoHtml,
        List<SetorDTO> setores
) {}