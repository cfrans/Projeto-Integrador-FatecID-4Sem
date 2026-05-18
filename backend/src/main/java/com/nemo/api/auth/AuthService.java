package com.nemo.api.auth;

import com.nemo.api.config.exception.BadCredentialsException;
import com.nemo.api.config.exception.ResourceNotFoundException;
import com.nemo.api.model.TipoAcesso;
import com.nemo.api.model.UsuarioSistema;
import com.nemo.api.repository.TipoAcessoRepository;
import com.nemo.api.repository.UsuarioSistemaRepository;
import com.nemo.api.repository.UsuarioDestinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioSistemaRepository repository;
    private final TipoAcessoRepository tipoAcessoRepository;
    private final UsuarioDestinoRepository usuarioDestinoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        String email = request.email();
        String senha = request.senha();
        String nome;
        String role;
        String senhaHash;
        boolean primeiroAcesso;

        var usuarioSistema = repository.findByEmail(email);
        if (usuarioSistema.isPresent()) {
            var u = usuarioSistema.get();
            nome = u.getNome();
            role = u.getTipoAcesso().getTipoAcesso();
            senhaHash = u.getSenhaHash();
            primeiroAcesso = u.getPrimeiroAcesso();
        } else {
            var usuarioDestino = usuarioDestinoRepository.findByEmail(email);
            if (usuarioDestino.isPresent()) {
                var u = usuarioDestino.get();
                nome = u.getNome();
                role = u.getTipoAcesso().getTipoAcesso();
                senhaHash = u.getSenhaHash();
                primeiroAcesso = u.getPrimeiroAcesso();
            } else {
                throw new BadCredentialsException("Credenciais inválidas");
            }
        }

        if (!passwordEncoder.matches(senha, senhaHash)) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        var claims = Map.<String, Object>of(
                "nome", nome,
                "role", role,
                "primeiroAcesso", primeiroAcesso
        );

        String token = jwtService.generate(email, claims);

        // Registrar último login
        if (usuarioSistema.isPresent()) {
            var u = usuarioSistema.get();
            u.setUltimoLogin(java.time.LocalDateTime.now());
            repository.save(u);
        } else {
            var u = usuarioDestinoRepository.findByEmail(email).get();
            u.setUltimoLogin(java.time.LocalDateTime.now());
            usuarioDestinoRepository.save(u);
        }

        return new LoginResponse(token, nome, role, primeiroAcesso);
    }

    public void trocarSenha(TrocarSenhaRequest request, String token) {
        String email = jwtService.extractEmail(token);

        var usuarioSistema = repository.findByEmail(email);
        if (usuarioSistema.isPresent()) {
            var u = usuarioSistema.get();
            if (!passwordEncoder.matches(request.senhaAtual(), u.getSenhaHash())) {
                throw new BadCredentialsException("Senha atual incorreta");
            }
            u.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
            u.setPrimeiroAcesso(false);
            repository.save(u);
            return;
        }

        var usuarioDestino = usuarioDestinoRepository.findByEmail(email);
        if (usuarioDestino.isPresent()) {
            var u = usuarioDestino.get();
            if (!passwordEncoder.matches(request.senhaAtual(), u.getSenhaHash())) {
                throw new BadCredentialsException("Senha atual incorreta");
            }
            u.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
            u.setPrimeiroAcesso(false);
            usuarioDestinoRepository.save(u);
            return;
        }

        throw new ResourceNotFoundException("Usuário não encontrado");
    }

    public UsuarioDTO getMe(String token) {
        String email = jwtService.extractEmail(token);
        
        var usuarioSistema = repository.findByEmail(email);
        if (usuarioSistema.isPresent()) {
            var u = usuarioSistema.get();
            return new UsuarioDTO(
                    "S_" + u.getIdUsuarioSistema(),
                    u.getNome(),
                    u.getEmail(),
                    u.getTipoAcesso().getTipoAcesso(),
                    u.getFoto(),
                    u.getPrimeiroAcesso(),
                    u.getUltimoLogin()
            );
        }

        var usuarioDestino = usuarioDestinoRepository.findByEmail(email);
        if (usuarioDestino.isPresent()) {
            var u = usuarioDestino.get();
            return new UsuarioDTO(
                    "D_" + u.getIdUsuarioDestino(),
                    u.getNome(),
                    u.getEmail(),
                    u.getTipoAcesso().getTipoAcesso(),
                    null,
                    u.getPrimeiroAcesso(),
                    u.getUltimoLogin()
            );
        }

        throw new ResourceNotFoundException("Usuário não encontrado");
    }

    public void atualizarFoto(byte[] fotoBytes, String token) {
        if (fotoBytes == null || fotoBytes.length == 0) {
            throw new IllegalArgumentException("A foto não pode estar vazia");
        }

        String email = jwtService.extractEmail(token);
        var usuario = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Apenas usuários do sistema podem ter foto de perfil"));

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

        List<UsuarioDTO> todos = new ArrayList<>();
        
        repository.findAll().forEach(u -> todos.add(new UsuarioDTO(
                "S_" + u.getIdUsuarioSistema(),
                u.getNome(),
                u.getEmail(),
                u.getTipoAcesso().getTipoAcesso(),
                u.getFoto(),
                u.getPrimeiroAcesso(),
                u.getUltimoLogin()
        )));
        
        usuarioDestinoRepository.findAll().forEach(u -> todos.add(new UsuarioDTO(
                "D_" + u.getIdUsuarioDestino(),
                u.getNome(),
                u.getEmail(),
                u.getTipoAcesso().getTipoAcesso(),
                null,
                u.getPrimeiroAcesso(),
                u.getUltimoLogin()
        )));

        return todos;
    }

    public void alterarRole(String idUsuarioStr, Integer idTipoAcesso, String token) {
        String email = jwtService.extractEmail(token);
        var usuarioAtual = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (!"Admin".equals(usuarioAtual.getTipoAcesso().getTipoAcesso())) {
            throw new BadCredentialsException("Apenas admins podem alterar roles");
        }

        var tipoAcesso = tipoAcessoRepository.findById(idTipoAcesso)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de acesso não encontrado"));

        if (idUsuarioStr.startsWith("S_")) {
            Integer id = Integer.parseInt(idUsuarioStr.substring(2));
            var usuario = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
            usuario.setTipoAcesso(tipoAcesso);
            repository.save(usuario);
        } else if (idUsuarioStr.startsWith("D_")) {
            Integer id = Integer.parseInt(idUsuarioStr.substring(2));
            var usuario = usuarioDestinoRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
            usuario.setTipoAcesso(tipoAcesso);
            usuarioDestinoRepository.save(usuario);
        } else {
            throw new IllegalArgumentException("Formato de ID inválido");
        }
    }

    public UsuarioDTO atualizarPerfil(AtualizarPerfilRequest request, String token) {
        String email = jwtService.extractEmail(token);
        
        var usuarioSistema = repository.findByEmail(email);
        if (usuarioSistema.isPresent()) {
            var u = usuarioSistema.get();
            if (request.nome() != null && !request.nome().isEmpty()) {
                u.setNome(request.nome());
            }
            if (request.email() != null && !request.email().isEmpty()) {
                if (!request.email().equals(email) && (repository.findByEmail(request.email()).isPresent() || usuarioDestinoRepository.findByEmail(request.email()).isPresent())) {
                    throw new BadCredentialsException("Este email já está em uso");
                }
                u.setEmail(request.email());
            }
            repository.save(u);
            return new UsuarioDTO(
                    "S_" + u.getIdUsuarioSistema(),
                    u.getNome(),
                    u.getEmail(),
                    u.getTipoAcesso().getTipoAcesso(),
                    u.getFoto(),
                    u.getPrimeiroAcesso(),
                    u.getUltimoLogin()
            );
        }

        var usuarioDestino = usuarioDestinoRepository.findByEmail(email);
        if (usuarioDestino.isPresent()) {
            var u = usuarioDestino.get();
            if (request.nome() != null && !request.nome().isEmpty()) {
                u.setNome(request.nome());
            }
            if (request.email() != null && !request.email().isEmpty()) {
                if (!request.email().equals(email) && (repository.findByEmail(request.email()).isPresent() || usuarioDestinoRepository.findByEmail(request.email()).isPresent())) {
                    throw new BadCredentialsException("Este email já está em uso");
                }
                u.setEmail(request.email());
            }
            usuarioDestinoRepository.save(u);
            return new UsuarioDTO(
                    "D_" + u.getIdUsuarioDestino(),
                    u.getNome(),
                    u.getEmail(),
                    u.getTipoAcesso().getTipoAcesso(),
                    null,
                    u.getPrimeiroAcesso(),
                    u.getUltimoLogin()
            );
        }

        throw new ResourceNotFoundException("Usuário não encontrado");
    }

    public List<TipoAcesso> listarTiposAcesso() {
        return tipoAcessoRepository.findAll();
    }
}

