package com.nemo.api.model.dto;

public record QuizOpcaoDTO(
    Integer idOpcao,
    String texto,
    Boolean isCorreta
) {}
