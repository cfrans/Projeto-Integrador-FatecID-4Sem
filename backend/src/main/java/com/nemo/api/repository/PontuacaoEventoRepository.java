package com.nemo.api.repository;

import com.nemo.api.model.PontuacaoEvento;
import com.nemo.api.pontuacao.TipoEvento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PontuacaoEventoRepository extends JpaRepository<PontuacaoEvento, Integer> {

    boolean existsByDisparo_IdDisparoAndTipoEvento(Integer idDisparo, TipoEvento tipoEvento);

    boolean existsByUsuarioDestino_IdUsuarioDestinoAndTipoEventoAndReferenciaExterna(
            Integer idUsuarioDestino, TipoEvento tipoEvento, String referenciaExterna);
}
