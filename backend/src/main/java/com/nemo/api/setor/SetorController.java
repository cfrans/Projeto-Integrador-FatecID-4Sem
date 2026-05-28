package com.nemo.api.setor;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/setores")
@RequiredArgsConstructor
public class SetorController {

    private final SetorService setorService;

    @GetMapping
    public ResponseEntity<List<SetorDTO>> listar() {
        return ResponseEntity.ok(setorService.listar());
    }
}