package com.nemo.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter @Setter
@Entity
@Table(name = "pergunta_seguranca")
public class PerguntaSeguranca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pergunta")
    private Integer idPergunta;

    private String texto;

    // A coluna no banco e TINYINT (V6 migration); avisa o Hibernate pra nao bater na schema validation.
    @JdbcTypeCode(SqlTypes.TINYINT)
    private Integer grupo;
}
