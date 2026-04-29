package com.nemo.api.auth;

import com.nemo.api.config.exception.BadCredentialsException;
import com.nemo.api.config.exception.ResourceNotFoundException;
import com.nemo.api.model.TipoAcesso;
import com.nemo.api.model.UsuarioSistema;
import com.nemo.api.repository.TipoAcessoRepository;
import com.nemo.api.repository.UsuarioSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioSistemaRepository repository;
    private final TipoAcessoRepository tipoAcessoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        var usuario = repository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new BadCredentialsException("Credenciais inválidas");
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
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.senhaAtual(), usuario.getSenhaHash())) {
            throw new BadCredentialsException("Senha atual incorreta");
        }

        usuario.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
        usuario.setPrimeiroAcesso(false);
        repository.save(usuario);
    }

    public UsuarioDTO getMe(String token) {
        String email = jwtService.extractEmail(token);
        var usuario = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        return new UsuarioDTO(
                usuario.getIdUsuarioSistema(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipoAcesso().getTipoAcesso(),
                usuario.getFoto()
        );
    }

    public void atualizarFoto(byte[] fotoBytes, String token) {
        if (fotoBytes == null || fotoBytes.length == 0) {
            throw new IllegalArgumentException("A foto não pode estar vazia");
        }

        String email = jwtService.extractEmail(token);
        var usuario = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        usuario.setFoto(fotoBytes);
        repository.save(usuario);
    }

    public List<UsuarioDTO> listarUsuarios(String token) {
        String email = jwtService.extractEmail(token);
        var usuarioAtual = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (!"Admin".equals(usuarioAtual.getTipoAcesso().getTipoAcesso())) {
            throw new BadCredentialsException("Apenas admins podem listar usuários");
        }

        return repository.findAll().stream()
                .map(u -> new UsuarioDTO(
                        u.getIdUsuarioSistema(),
                        u.getNome(),
                        u.getEmail(),
                        u.getTipoAcesso().getTipoAcesso(),
                        u.getFoto()
                ))
                .toList();
    }

    public void alterarRole(Integer idUsuario, Integer idTipoAcesso, String token) {
        String email = jwtService.extractEmail(token);
        var usuarioAtual = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (!"Admin".equals(usuarioAtual.getTipoAcesso().getTipoAcesso())) {
            throw new BadCredentialsException("Apenas admins podem alterar roles");
        }

        var usuario = repository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        var tipoAcesso = tipoAcessoRepository.findById(idTipoAcesso)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de acesso não encontrado"));

        usuario.setTipoAcesso(tipoAcesso);
        repository.save(usuario);
    }

    public UsuarioDTO atualizarPerfil(AtualizarPerfilRequest request, String token) {
        String email = jwtService.extractEmail(token);
        var usuario = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (request.nome() != null && !request.nome().isEmpty()) {
            usuario.setNome(request.nome());
        }

        if (request.email() != null && !request.email().isEmpty()) {
            // Verificar se o novo email já existe
            if (!request.email().equals(email) && repository.findByEmail(request.email()).isPresent()) {
                throw new BadCredentialsException("Este email já está em uso");
            }
            usuario.setEmail(request.email());
        }

        repository.save(usuario);

        return new UsuarioDTO(
                usuario.getIdUsuarioSistema(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipoAcesso().getTipoAcesso(),
                usuario.getFoto()
        );
    }

    public List<TipoAcesso> listarTiposAcesso() {
        return tipoAcessoRepository.findAll();
    }
}

