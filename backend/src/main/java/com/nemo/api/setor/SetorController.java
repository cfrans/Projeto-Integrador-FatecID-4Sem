package com.nemo.api.setor;

import com.nemo.api.campanha.SetorDTO;
import com.nemo.api.repository.SetorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/setores")
@RequiredArgsConstructor
public class SetorController {

    private final SetorRepository setorRepository;

    @GetMapping
    public ResponseEntity<List<SetorDTO>> listar() {
        return ResponseEntity.ok(
                setorRepository.findAll().stream()
                        .map(s -> new SetorDTO(s.getIdSetor(), s.getNomeSetor()))
                        .toList()
        );
    }
}