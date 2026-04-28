package com.nemo.api.repository;

import com.nemo.api.model.Disparo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisparoRepository extends JpaRepository<Disparo, Integer> {
    java.util.Optional<Disparo> findByTokenUnico(String tokenUnico);
}