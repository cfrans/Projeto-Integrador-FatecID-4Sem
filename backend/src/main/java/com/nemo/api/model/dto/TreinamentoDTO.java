package com.nemo.api.model.dto;

import java.util.List;

public record TreinamentoDTO(
    Integer idTreinamento,
    String tipo,
    String titulo,
    String descricao,
    String categoria,
    Integer pontos,
    boolean concluido,
    
    // Para videos
    String youtubeId,
    Integer duracaoMinutos,
    
    // Para quizzes
    String nivel,
    String corTema,
    List<QuizPerguntaDTO> perguntas
) {}
