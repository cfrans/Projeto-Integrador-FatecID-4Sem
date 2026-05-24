package com.nemo.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
@Entity
@Table(name = "quiz_pergunta")
public class QuizPergunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPergunta;

    private String enunciado;

    private String explicacao;

    @ManyToOne
    @JoinColumn(name = "id_treinamento")
    private TreinamentoQuiz treinamentoQuiz;

    @OneToMany(mappedBy = "pergunta", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<QuizOpcao> opcoes;
}
