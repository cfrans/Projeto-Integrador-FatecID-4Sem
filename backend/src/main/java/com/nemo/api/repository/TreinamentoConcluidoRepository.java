package com.nemo.api.repository;

import com.nemo.api.model.TreinamentoConcluido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface TreinamentoConcluidoRepository extends JpaRepository<TreinamentoConcluido, Integer> {
    boolean existsByUsuarioDestino_IdUsuarioDestinoAndTreinamento_IdTreinamento(Integer idUsuarioDestino, Integer idTreinamento);
    List<TreinamentoConcluido> findAllByUsuarioDestino_IdUsuarioDestino(Integer idUsuarioDestino);
}
