package com.nemo.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
@Entity
@Table(name = "treinamento")
@Inheritance(strategy = InheritanceType.JOINED)
public class Treinamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTreinamento;

    private String tipo;

    private String titulo;

    private String descricao;

    private String categoria;

    private Integer pontos;

    private LocalDateTime criadoEm;
}
