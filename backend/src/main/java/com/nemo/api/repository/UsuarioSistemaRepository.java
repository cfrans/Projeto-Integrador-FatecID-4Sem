package com.nemo.api.repository;

import com.nemo.api.model.UsuarioSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioSistemaRepository extends JpaRepository<UsuarioSistema, Integer> {
    Optional<UsuarioSistema> findByEmail(String email);
}