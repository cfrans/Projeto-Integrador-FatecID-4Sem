package com.nemo.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "usuario_destino")
public class UsuarioDestino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuarioDestino;

    private Integer matricula;
    private String nome;
    private String email;
    private String senhaHash;
    private Integer pontuacao;
    private Boolean primeiroAcesso;
    private java.time.LocalDateTime ultimoLogin;

    @ManyToOne
    @JoinColumn(name = "id_setor")
    private Setor setor;

    @ManyToOne
    @JoinColumn(name = "id_tipo_acesso")
    private TipoAcesso tipoAcesso;
}