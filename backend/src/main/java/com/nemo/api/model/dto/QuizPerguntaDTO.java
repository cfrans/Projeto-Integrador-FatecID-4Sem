package com.nemo.api.model.dto;

import java.util.List;

public record QuizPerguntaDTO(
    Integer idPergunta,
    String enunciado,
    String explicacao,
    List<QuizOpcaoDTO> opcoes
) {}
