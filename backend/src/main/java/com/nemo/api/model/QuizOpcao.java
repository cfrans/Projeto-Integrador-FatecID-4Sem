package com.nemo.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "quiz_opcao")
public class QuizOpcao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idOpcao;

    private String texto;

    private Boolean isCorreta;

    @ManyToOne
    @JoinColumn(name = "id_pergunta")
    private QuizPergunta pergunta;
}
