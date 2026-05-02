package com.nemo.api.model;

import com.nemo.api.pontuacao.TipoEvento;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
@Entity
@Table(name = "pontuacao_evento")
public class PontuacaoEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPontuacaoEvento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario_destino")
    private UsuarioDestino usuarioDestino;

    @ManyToOne
    @JoinColumn(name = "id_disparo")
    private Disparo disparo;

    @ManyToOne
    @JoinColumn(name = "id_campanha")
    private Campanha campanha;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_evento", nullable = false, length = 30)
    private TipoEvento tipoEvento;

    @Column(nullable = false)
    private Integer delta;

    @Column(name = "saldo_apos", nullable = false)
    private Integer saldoApos;

    @Column(name = "referencia_externa", length = 100)
    private String referenciaExterna;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) criadoEm = LocalDateTime.now();
    }
}
