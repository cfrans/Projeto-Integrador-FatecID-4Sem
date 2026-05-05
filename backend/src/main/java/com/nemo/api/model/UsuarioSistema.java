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

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] foto;

    @ManyToOne
    @JoinColumn(name = "id_tipo_acesso")
    private TipoAcesso tipoAcesso;
}