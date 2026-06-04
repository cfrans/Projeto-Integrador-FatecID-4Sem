package com.nemo.api.repository;

import com.nemo.api.model.Campanha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampanhaRepository extends JpaRepository<Campanha, Integer> {

    @Query("""
            SELECT DISTINCT c FROM Campanha c
            JOIN FETCH c.modelo
            LEFT JOIN FETCH c.setores
            ORDER BY c.dataCriacao DESC
            """)
    List<Campanha> findAllWithModeloAndSetores();
}