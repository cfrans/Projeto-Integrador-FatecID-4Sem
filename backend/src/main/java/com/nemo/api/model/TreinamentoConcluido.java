package com.nemo.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
@Entity
@Table(name = "treinamento_concluido")
public class TreinamentoConcluido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTreinamentoConcluido;

    @ManyToOne
    @JoinColumn(name = "id_usuario_destino")
    private UsuarioDestino usuarioDestino;

    @ManyToOne
    @JoinColumn(name = "id_treinamento")
    private Treinamento treinamento;

    private LocalDateTime dataConclusao = LocalDateTime.now();
}
