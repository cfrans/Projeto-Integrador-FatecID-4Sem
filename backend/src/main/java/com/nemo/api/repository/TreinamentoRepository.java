package com.nemo.api.repository;

import com.nemo.api.model.Treinamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreinamentoRepository extends JpaRepository<Treinamento, Integer> {

    @Query("""
            SELECT DISTINCT t FROM Treinamento t
            LEFT JOIN FETCH t.perguntas p
            LEFT JOIN FETCH p.opcoes
            ORDER BY t.criadoEm DESC
            """)
    List<Treinamento> findAllByOrderByCriadoEmDesc();
}
