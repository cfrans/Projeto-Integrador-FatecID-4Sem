package com.nemo.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
@Entity
@Table(name = "modelo")
public class Modelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idModelo;

    private String nomeModelo;
    private String dominioAlvo;
    private String remetenteFalso;
    private String assuntoPadrao;
    private LocalDateTime data;

    @Column(columnDefinition = "TEXT")
    private String textoHtml;

    @ManyToOne
    @JoinColumn(name = "id_usuario_sistema")
    private UsuarioSistema usuarioSistema;
}