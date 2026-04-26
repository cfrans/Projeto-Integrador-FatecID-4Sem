package com.nemo.api.campanha;

import com.nemo.api.auth.JwtService;
import com.nemo.api.model.Campanha;
import com.nemo.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CampanhaService {

    private final CampanhaRepository campanhaRepository;
    private final ModeloRepository modeloRepository;
    private final SetorRepository setorRepository;
    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final JwtService jwtService;

    public List<CampanhaDTO> listar() {
        return campanhaRepository.findAll().stream().map(this::toDTO).toList();
    }

    public CampanhaDTO criar(CampanhaRequest request, String token) {
        String email = jwtService.extractEmail(token);
        var usuario = usuarioSistemaRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        var modelo = modeloRepository.findById(request.idModelo())
                .orElseThrow(() -> new RuntimeException("Modelo não encontrado"));
        var setores = setorRepository.findAllById(request.idSetores());

        var campanha = new Campanha();
        campanha.setNomeCampanha(request.nomeCampanha());
        campanha.setAssuntoEmail(request.assuntoEmail());
        campanha.setNomeAnexo(request.nomeAnexo());
        campanha.setStatusEnvio("Pendente");
        campanha.setDataCriacao(LocalDateTime.now());
        campanha.setModelo(modelo);
        campanha.setUsuarioSistema(usuario);
        campanha.setSetores(setores);

        return toDTO(campanhaRepository.save(campanha));
    }

    public void deletar(Integer id) {
        campanhaRepository.deleteById(id);
    }

    private CampanhaDTO toDTO(Campanha c) {
        return new CampanhaDTO(
                c.getIdCampanha(),
                c.getNomeCampanha(),
                c.getAssuntoEmail(),
                c.getNomeAnexo(),
                c.getStatusEnvio(),
                c.getDataCriacao(),
                c.getModelo().getIdModelo(),
                c.getModelo().getNomeModelo(),
                c.getModelo().getDominioAlvo(),
                c.getModelo().getTextoHtml(),
                c.getSetores().stream()
                        .map(s -> new SetorDTO(s.getIdSetor(), s.getNomeSetor()))
                        .toList()
        );
    }
}