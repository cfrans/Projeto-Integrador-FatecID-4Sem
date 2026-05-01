package com.nemo.api.usuario;

import com.nemo.api.config.exception.ResourceNotFoundException;
import com.nemo.api.model.UsuarioDestino;
import com.nemo.api.repository.SetorRepository;
import com.nemo.api.repository.TipoAcessoRepository;
import com.nemo.api.repository.UsuarioDestinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioDestinoService {

    private final UsuarioDestinoRepository repository;
    private final SetorRepository setorRepository;
    private final TipoAcessoRepository tipoAcessoRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UsuarioDestinoDTO> listar() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    public UsuarioDestinoDTO criar(UsuarioDestinoRequest request) {
        var setor = setorRepository.findById(request.idSetor())
                .orElseThrow(() -> new ResourceNotFoundException("Setor não encontrado"));

        var tipoAcesso = tipoAcessoRepository.findById(2)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de acesso não encontrado"));

        var usuario = new UsuarioDestino();
        usuario.setMatricula(request.matricula());
        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setSenhaHash(passwordEncoder.encode(String.valueOf(request.matricula())));
        usuario.setPontuacao(0);
        usuario.setPrimeiroAcesso(true);
        usuario.setSetor(setor);
        usuario.setTipoAcesso(tipoAcesso);

        return toDTO(repository.save(usuario));
    }

    public UsuarioDestinoDTO atualizar(Integer id, UsuarioDestinoRequest request) {
        var usuario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        var setor = setorRepository.findById(request.idSetor())
                .orElseThrow(() -> new ResourceNotFoundException("Setor não encontrado"));

        usuario.setMatricula(request.matricula());
        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setSetor(setor);

        return toDTO(repository.save(usuario));
    }

    public void deletar(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado");
        }
        repository.deleteById(id);
    }

    private UsuarioDestinoDTO toDTO(UsuarioDestino u) {
        return new UsuarioDestinoDTO(
                u.getIdUsuarioDestino(),
                u.getMatricula(),
                u.getNome(),
                u.getEmail(),
                u.getPontuacao(),
                u.getSetor().getIdSetor(),
                u.getSetor().getNomeSetor()
        );
    }
}