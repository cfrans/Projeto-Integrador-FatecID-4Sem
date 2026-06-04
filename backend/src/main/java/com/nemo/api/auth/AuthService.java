package com.nemo.api.auth;

import com.nemo.api.config.exception.BadCredentialsException;
import com.nemo.api.config.exception.ResourceNotFoundException;
import com.nemo.api.model.PerguntaSeguranca;
import com.nemo.api.model.TipoAcesso;
import com.nemo.api.model.UsuarioSistema;
import com.nemo.api.repository.PerguntaSegurancaRepository;
import com.nemo.api.repository.TipoAcessoRepository;
import com.nemo.api.repository.UsuarioSistemaRepository;
import com.nemo.api.repository.UsuarioDestinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import org.springframework.data.domain.Sort;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioSistemaRepository repository;
    private final TipoAcessoRepository tipoAcessoRepository;
    private final UsuarioDestinoRepository usuarioDestinoRepository;
    private final PerguntaSegurancaRepository perguntaSegurancaRepository;
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
                throw new BadCredentialsException("Usuário não encontrado");
            }
        }

        if (!passwordEncoder.matches(senha, senhaHash)) {
            throw new BadCredentialsException("Senha incorreta");
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
                    u.getPrimeiroAcesso(),
                    u.getUltimoLogin(),
                    u.getIdPergunta1(),
                    u.getIdPergunta2()
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
                    u.getPrimeiroAcesso(),
                    u.getUltimoLogin(),
                    u.getIdPergunta1(),
                    u.getIdPergunta2()
            );
        }

        throw new ResourceNotFoundException("Usuário não encontrado");
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
                u.getPrimeiroAcesso(),
                u.getUltimoLogin(),
                u.getIdPergunta1(),
                u.getIdPergunta2()
        )));

        usuarioDestinoRepository.findAll(Sort.unsorted()).forEach(u -> todos.add(new UsuarioDTO(
                "D_" + u.getIdUsuarioDestino(),
                u.getNome(),
                u.getEmail(),
                u.getTipoAcesso().getTipoAcesso(),
                u.getPrimeiroAcesso(),
                u.getUltimoLogin(),
                u.getIdPergunta1(),
                u.getIdPergunta2()
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
                    u.getPrimeiroAcesso(),
                    u.getUltimoLogin(),
                    u.getIdPergunta1(),
                    u.getIdPergunta2()
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
                    u.getPrimeiroAcesso(),
                    u.getUltimoLogin(),
                    u.getIdPergunta1(),
                    u.getIdPergunta2()
            );
        }

        throw new ResourceNotFoundException("Usuário não encontrado");
    }

    public List<TipoAcesso> listarTiposAcesso() {
        return tipoAcessoRepository.findAll();
    }

    public List<PerguntaSegurancaDTO> listarPerguntasSeguranca() {
        return perguntaSegurancaRepository
                .findAllByOrderByGrupoAscIdPerguntaAsc()
                .stream()
                .map(p -> new PerguntaSegurancaDTO(p.getIdPergunta(), p.getTexto(), p.getGrupo()))
                .toList();
    }

    public void atualizarPerguntasSeguranca(PerguntasSegurancaRequest request, String token) {
        if (request.idPergunta1() == null || request.idPergunta2() == null) {
            throw new BadCredentialsException("As duas perguntas precisam ser selecionadas");
        }
        if (request.resposta1() == null || request.resposta1().isBlank()
                || request.resposta2() == null || request.resposta2().isBlank()) {
            throw new BadCredentialsException("As duas respostas precisam ser preenchidas");
        }

        PerguntaSeguranca p1 = perguntaSegurancaRepository.findById(request.idPergunta1())
                .orElseThrow(() -> new ResourceNotFoundException("Pergunta 1 não encontrada"));
        PerguntaSeguranca p2 = perguntaSegurancaRepository.findById(request.idPergunta2())
                .orElseThrow(() -> new ResourceNotFoundException("Pergunta 2 não encontrada"));

        if (p1.getGrupo() != 1) {
            throw new BadCredentialsException("Pergunta 1 inválida (deve ser do grupo 1)");
        }
        if (p2.getGrupo() != 2) {
            throw new BadCredentialsException("Pergunta 2 inválida (deve ser do grupo 2)");
        }

        String hash1 = passwordEncoder.encode(request.resposta1().trim().toLowerCase());
        String hash2 = passwordEncoder.encode(request.resposta2().trim().toLowerCase());

        String email = jwtService.extractEmail(token);

        var usuarioSistema = repository.findByEmail(email);
        if (usuarioSistema.isPresent()) {
            var u = usuarioSistema.get();
            u.setIdPergunta1(p1.getIdPergunta());
            u.setRespostaHash1(hash1);
            u.setIdPergunta2(p2.getIdPergunta());
            u.setRespostaHash2(hash2);
            repository.save(u);
            return;
        }

        var usuarioDestino = usuarioDestinoRepository.findByEmail(email);
        if (usuarioDestino.isPresent()) {
            var u = usuarioDestino.get();
            u.setIdPergunta1(p1.getIdPergunta());
            u.setRespostaHash1(hash1);
            u.setIdPergunta2(p2.getIdPergunta());
            u.setRespostaHash2(hash2);
            usuarioDestinoRepository.save(u);
            return;
        }

        throw new ResourceNotFoundException("Usuário não encontrado");
    }
    public List<PerguntaSegurancaDTO> buscarPerguntasUsuario(String email) {
        Integer idPergunta1 = null;
        Integer idPergunta2 = null;

        var usuarioSistema = repository.findByEmail(email);
        if (usuarioSistema.isPresent()) {
            idPergunta1 = usuarioSistema.get().getIdPergunta1();
            idPergunta2 = usuarioSistema.get().getIdPergunta2();
        } else {
            var usuarioDestino = usuarioDestinoRepository.findByEmail(email);
            if (usuarioDestino.isPresent()) {
                idPergunta1 = usuarioDestino.get().getIdPergunta1();
                idPergunta2 = usuarioDestino.get().getIdPergunta2();
            } else {
                throw new ResourceNotFoundException("Usuário não encontrado");
            }
        }

        if (idPergunta1 == null || idPergunta2 == null) {
            throw new BadCredentialsException("Usuário não configurou as perguntas de segurança");
        }

        PerguntaSeguranca p1 = perguntaSegurancaRepository.findById(idPergunta1).orElse(null);
        PerguntaSeguranca p2 = perguntaSegurancaRepository.findById(idPergunta2).orElse(null);

        if (p1 == null || p2 == null) {
            throw new BadCredentialsException("Perguntas de segurança inválidas ou não encontradas");
        }

        return List.of(
            new PerguntaSegurancaDTO(p1.getIdPergunta(), p1.getTexto(), p1.getGrupo()),
            new PerguntaSegurancaDTO(p2.getIdPergunta(), p2.getTexto(), p2.getGrupo())
        );
    }

    public void recuperarSenha(RecuperarSenhaRequest request) {
        String email = request.email();
        String resp1 = request.resposta1().trim().toLowerCase();
        String resp2 = request.resposta2().trim().toLowerCase();

        var usuarioSistema = repository.findByEmail(email);
        if (usuarioSistema.isPresent()) {
            var u = usuarioSistema.get();
            if (u.getIdPergunta1() == null || u.getIdPergunta2() == null) {
                throw new BadCredentialsException("Perguntas de segurança não configuradas");
            }
            if (!passwordEncoder.matches(resp1, u.getRespostaHash1()) || 
                !passwordEncoder.matches(resp2, u.getRespostaHash2())) {
                throw new BadCredentialsException("Respostas incorretas");
            }
            u.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
            repository.save(u);
            return;
        }

        var usuarioDestino = usuarioDestinoRepository.findByEmail(email);
        if (usuarioDestino.isPresent()) {
            var u = usuarioDestino.get();
            if (u.getIdPergunta1() == null || u.getIdPergunta2() == null) {
                throw new BadCredentialsException("Perguntas de segurança não configuradas");
            }
            if (!passwordEncoder.matches(resp1, u.getRespostaHash1()) || 
                !passwordEncoder.matches(resp2, u.getRespostaHash2())) {
                throw new BadCredentialsException("Respostas incorretas");
            }
            u.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
            usuarioDestinoRepository.save(u);
            return;
        }

        throw new ResourceNotFoundException("Usuário não encontrado");
    }
}
