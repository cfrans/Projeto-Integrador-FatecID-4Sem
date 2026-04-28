package com.nemo.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
@Entity
@Table(name = "disparos")
public class Disparo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDisparo;

    private String tokenUnico;
    private Boolean clicouLink    = false;
    private Boolean abriuAnexo    = false;
    private Boolean reportouPhishing = false;
    private LocalDateTime dataEnvio;

    @ManyToOne
    @JoinColumn(name = "id_usuario_destino")
    private UsuarioDestino usuarioDestino;

    @ManyToOne
    @JoinColumn(name = "id_campanha")
    private Campanha campanha;
}