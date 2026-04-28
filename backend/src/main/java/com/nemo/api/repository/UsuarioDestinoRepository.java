package com.nemo.api.repository;

import com.nemo.api.model.UsuarioDestino;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UsuarioDestinoRepository extends JpaRepository<UsuarioDestino, Integer> {
    List<UsuarioDestino> findBySetor_IdSetorIn(List<Integer> idSetores);
    java.util.Optional<UsuarioDestino> findByEmail(String email);
}