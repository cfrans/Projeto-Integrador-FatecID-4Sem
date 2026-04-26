package com.nemo.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@Entity
@Table(name = "campanha")
public class Campanha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCampanha;

    private String nomeCampanha;
    private String assuntoEmail;
    private String nomeAnexo;
    private String statusEnvio;
    private LocalDateTime dataCriacao;

    @ManyToOne
    @JoinColumn(name = "id_modelo")
    private Modelo modelo;

    @ManyToOne
    @JoinColumn(name = "id_usuario_sistema")
    private UsuarioSistema usuarioSistema;

    @ManyToMany
    @JoinTable(
            name = "setor_campanha",
            joinColumns = @JoinColumn(name = "id_campanha"),
            inverseJoinColumns = @JoinColumn(name = "id_setor")
    )
    private List<Setor> setores;
}