package com.nemo.api.auth;

import com.nemo.api.repository.UsuarioSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioSistemaRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        var usuario = repository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        var claims = Map.<String, Object>of(
                "nome", usuario.getNome(),
                "role", usuario.getTipoAcesso().getTipoAcesso(),
                "primeiroAcesso", usuario.getPrimeiroAcesso()
        );

        String token = jwtService.generate(usuario.getEmail(), claims);

        return new LoginResponse(
                token,
                usuario.getNome(),
                usuario.getTipoAcesso().getTipoAcesso(),
                usuario.getPrimeiroAcesso()
        );
    }

    public void trocarSenha(TrocarSenhaRequest request, String token) {
        String email = jwtService.extractEmail(token);

        var usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.senhaAtual(), usuario.getSenhaHash())) {
            throw new RuntimeException("Senha atual incorreta");
        }

        usuario.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
        usuario.setPrimeiroAcesso(false);
        repository.save(usuario);
    }
}

