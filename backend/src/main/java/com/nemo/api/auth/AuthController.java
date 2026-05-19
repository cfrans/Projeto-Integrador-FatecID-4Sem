package com.nemo.api.auth;

import com.nemo.api.model.TipoAcesso;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PutMapping("/trocar-senha")
    public ResponseEntity<Void> trocarSenha(@RequestBody TrocarSenhaRequest request,
                                            @RequestHeader("Authorization") String authHeader) {
        authService.trocarSenha(request, authHeader.replace("Bearer ", ""));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> getMe(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(authService.getMe(authHeader.replace("Bearer ", "")));
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioDTO> atualizarPerfil(@RequestBody AtualizarPerfilRequest request,
                                                      @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(authService.atualizarPerfil(request, authHeader.replace("Bearer ", "")));
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(authService.listarUsuarios(authHeader.replace("Bearer ", "")));
    }

    @PutMapping("/usuarios/{id}/role")
    public ResponseEntity<Void> alterarRole(@PathVariable String id,
                                            @RequestBody AlterarRoleRequest request,
                                            @RequestHeader("Authorization") String authHeader) {
        authService.alterarRole(id, request.idTipoAcesso(), authHeader.replace("Bearer ", ""));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tipos-acesso")
    public ResponseEntity<List<TipoAcesso>> listarTiposAcesso() {
        return ResponseEntity.ok(authService.listarTiposAcesso());
    }

    @GetMapping("/perguntas-seguranca")
    public ResponseEntity<List<PerguntaSegurancaDTO>> listarPerguntasSeguranca() {
        return ResponseEntity.ok(authService.listarPerguntasSeguranca());
    }

    @PutMapping("/me/perguntas-seguranca")
    public ResponseEntity<Void> atualizarPerguntasSeguranca(@RequestBody PerguntasSegurancaRequest request,
                                                            @RequestHeader("Authorization") String authHeader) {
        authService.atualizarPerguntasSeguranca(request, authHeader.replace("Bearer ", ""));
        return ResponseEntity.noContent().build();
    }
}