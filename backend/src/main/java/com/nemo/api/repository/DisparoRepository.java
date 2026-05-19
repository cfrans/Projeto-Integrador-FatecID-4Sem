package com.nemo.api.repository;

import com.nemo.api.model.Disparo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DisparoRepository extends JpaRepository<Disparo, Integer> {
    java.util.Optional<Disparo> findByTokenUnico(String tokenUnico);
    java.util.List<Disparo> findByCampanha_IdCampanha(Integer idCampanha);

    @Query("""
        SELECT COUNT(d),
               SUM(CASE WHEN d.clicouLink = TRUE THEN 1 ELSE 0 END),
               SUM(CASE WHEN d.reportouPhishing = TRUE THEN 1 ELSE 0 END),
               COUNT(DISTINCT d.campanha.idCampanha)
        FROM Disparo d
        WHERE d.dataEnvio >= :cutoff
        """)
    List<Object[]> resumoNoPeriodo(@Param("cutoff") LocalDateTime cutoff);

    @Query("""
        SELECT d.usuarioDestino.setor.nomeSetor,
               SUM(CASE WHEN d.clicouLink = TRUE THEN 1 ELSE 0 END),
               SUM(CASE WHEN d.abriuAnexo = TRUE THEN 1 ELSE 0 END),
               SUM(CASE WHEN d.reportouPhishing = TRUE THEN 1 ELSE 0 END)
        FROM Disparo d
        WHERE d.dataEnvio >= :cutoff
        GROUP BY d.usuarioDestino.setor.idSetor, d.usuarioDestino.setor.nomeSetor
        ORDER BY d.usuarioDestino.setor.idSetor
        """)
    List<Object[]> agregarPorSetor(@Param("cutoff") LocalDateTime cutoff);

    @Query("""
        SELECT YEAR(d.dataEnvio), MONTH(d.dataEnvio),
               SUM(CASE WHEN d.clicouLink = TRUE THEN 1 ELSE 0 END),
               SUM(CASE WHEN d.reportouPhishing = TRUE THEN 1 ELSE 0 END)
        FROM Disparo d
        WHERE d.dataEnvio >= :cutoff
        GROUP BY YEAR(d.dataEnvio), MONTH(d.dataEnvio)
        ORDER BY YEAR(d.dataEnvio), MONTH(d.dataEnvio)
        """)
    List<Object[]> agregarPorMes(@Param("cutoff") LocalDateTime cutoff);

    @Query("""
        SELECT c.idCampanha, c.dataCriacao, c.nomeCampanha,
               COUNT(d),
               SUM(CASE WHEN d.clicouLink = TRUE THEN 1 ELSE 0 END),
               SUM(CASE WHEN d.reportouPhishing = TRUE THEN 1 ELSE 0 END)
        FROM Disparo d JOIN d.campanha c
        WHERE c.dataCriacao >= :cutoff
        GROUP BY c.idCampanha, c.dataCriacao, c.nomeCampanha
        ORDER BY c.dataCriacao DESC
        """)
    List<Object[]> campanhasRecentes(@Param("cutoff") LocalDateTime cutoff);
}
