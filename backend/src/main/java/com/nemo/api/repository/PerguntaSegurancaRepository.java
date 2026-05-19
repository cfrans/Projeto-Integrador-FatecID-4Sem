package com.nemo.api.repository;

import com.nemo.api.model.PerguntaSeguranca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerguntaSegurancaRepository extends JpaRepository<PerguntaSeguranca, Integer> {
    List<PerguntaSeguranca> findAllByOrderByGrupoAscIdPerguntaAsc();
}
