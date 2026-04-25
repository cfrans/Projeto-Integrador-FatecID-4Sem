package com.nemo.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "tipo_acesso")
public class TipoAcesso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTipoAcesso;

    private String tipoAcesso;
}