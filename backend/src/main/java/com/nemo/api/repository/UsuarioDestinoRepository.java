package com.nemo.api.repository;

import com.nemo.api.model.UsuarioDestino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioDestinoRepository extends JpaRepository<UsuarioDestino, Integer> {

    @EntityGraph(attributePaths = {"setor", "tipoAcesso"})
    List<UsuarioDestino> findAll(Sort sort);

    @EntityGraph(attributePaths = {"setor", "tipoAcesso"})
    List<UsuarioDestino> findBySetor_IdSetorIn(List<Integer> idSetores);

    java.util.Optional<UsuarioDestino> findByEmail(String email);
    boolean existsByMatricula(Integer matricula);
    boolean existsByEmail(String email);
    long countBySetor_IdSetor(Integer idSetor);
}