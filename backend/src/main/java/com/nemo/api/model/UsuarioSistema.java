package com.nemo.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "usuario_sistema")
public class UsuarioSistema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuarioSistema;

    private String nome;
    private String email;
    private String senhaHash;
    private Boolean primeiroAcesso;
    private java.time.LocalDateTime ultimoLogin;

    @Column(name = "id_pergunta_1")
    private Integer idPergunta1;

    @Column(name = "resposta_hash_1")
    private String respostaHash1;

    @Column(name = "id_pergunta_2")
    private Integer idPergunta2;

    @Column(name = "resposta_hash_2")
    private String respostaHash2;

    @ManyToOne
    @JoinColumn(name = "id_tipo_acesso")
    private TipoAcesso tipoAcesso;
}