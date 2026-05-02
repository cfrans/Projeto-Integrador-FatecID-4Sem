package com.nemo.api.repository;

import com.nemo.api.model.Setor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SetorRepository extends JpaRepository<Setor, Integer> {
    Optional<Setor> findByNomeSetorIgnoreCase(String nomeSetor);
}