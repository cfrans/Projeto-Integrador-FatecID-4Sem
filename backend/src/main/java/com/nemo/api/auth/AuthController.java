package com.nemo.api.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}