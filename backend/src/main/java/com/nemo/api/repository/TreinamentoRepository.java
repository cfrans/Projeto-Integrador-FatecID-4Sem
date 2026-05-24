package com.nemo.api.repository;

import com.nemo.api.model.Treinamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreinamentoRepository extends JpaRepository<Treinamento, Integer> {
    List<Treinamento> findAllByOrderByCriadoEmDesc();
}
