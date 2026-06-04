package com.nemo.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import jakarta.persistence.FetchType;
import jakarta.persistence.CascadeType;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter @Setter
@Entity
@Table(name = "treinamento_quiz")
public class TreinamentoQuiz extends Treinamento {

    private String nivel;
    
    private String corTema;

    @OneToMany(mappedBy = "treinamentoQuiz", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<QuizPergunta> perguntas;
}
