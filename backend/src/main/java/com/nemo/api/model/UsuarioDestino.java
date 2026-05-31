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

    @Column(name = "is_real")
    private Boolean isReal = false;

    @Column(name = "is_ativo")
    private Boolean isAtivo = true;

    @Column(name = "id_pergunta_1")
    private Integer idPergunta1;

    @Column(name = "resposta_hash_1")
    private String respostaHash1;

    @Column(name = "id_pergunta_2")
    private Integer idPergunta2;

    @Column(name = "resposta_hash_2")
    private String respostaHash2;

    @ManyToOne
    @JoinColumn(name = "id_setor")
    private Setor setor;

    @ManyToOne
    @JoinColumn(name = "id_tipo_acesso")
    private TipoAcesso tipoAcesso;
}