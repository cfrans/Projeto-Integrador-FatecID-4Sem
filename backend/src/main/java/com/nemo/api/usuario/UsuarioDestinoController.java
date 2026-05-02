package com.nemo.api.usuario;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios-destino")
@RequiredArgsConstructor
public class UsuarioDestinoController {

    private final UsuarioDestinoService service;

    @GetMapping
    public ResponseEntity<List<UsuarioDestinoDTO>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @PostMapping
    public ResponseEntity<UsuarioDestinoDTO> criar(@RequestBody UsuarioDestinoRequest request) {
        return ResponseEntity.ok(service.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDestinoDTO> atualizar(@PathVariable Integer id,
                                                       @RequestBody UsuarioDestinoRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/importar")
    public ResponseEntity<ImportResultDTO> importar(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(service.importarCsv(file));
    }
}