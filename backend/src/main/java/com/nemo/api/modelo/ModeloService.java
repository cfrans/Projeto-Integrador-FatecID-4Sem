package com.nemo.api.modelo;

import com.nemo.api.auth.JwtService;
import com.nemo.api.config.exception.ResourceNotFoundException;
import com.nemo.api.model.Modelo;
import com.nemo.api.repository.ModeloRepository;
import com.nemo.api.repository.UsuarioSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ModeloService {

    private final ModeloRepository modeloRepository;
    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final JwtService jwtService;

    public List<ModeloDTO> listar() {
        return modeloRepository.findAll().stream().map(this::toDTO).toList();
    }

    public ModeloDTO criar(ModeloRequest request, String token) {
        String email = jwtService.extractEmail(token);
        var usuario = usuarioSistemaRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        var modelo = new Modelo();
        modelo.setNomeModelo(request.nomeModelo());
        modelo.setDominioAlvo(request.dominioAlvo());
        modelo.setRemetenteFalso(request.remetenteFalso());
        modelo.setAssuntoPadrao(request.assuntoPadrao());
        modelo.setTextoHtml(request.textoHtml());
        modelo.setData(LocalDateTime.now());
        modelo.setUsuarioSistema(usuario);

        Modelo salvo = modeloRepository.save(modelo);
        log.info("[MODELO] Modelo '{}' (ID {}) criado por {}", request.nomeModelo(), salvo.getIdModelo(), email);
        return toDTO(salvo);
    }

    public ModeloDTO atualizar(Integer id, ModeloRequest request) {
        var modelo = modeloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Modelo não encontrado"));

        modelo.setNomeModelo(request.nomeModelo());
        modelo.setDominioAlvo(request.dominioAlvo());
        modelo.setRemetenteFalso(request.remetenteFalso());
        modelo.setAssuntoPadrao(request.assuntoPadrao());
        modelo.setTextoHtml(request.textoHtml());

        return toDTO(modeloRepository.save(modelo));
    }

    public void deletar(Integer id) {
        var modelo = modeloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Modelo não encontrado"));
        modelo.setIsAtivo(false);
        modeloRepository.save(modelo);
        log.info("[MODELO] Modelo ID {} foi desativado.", id);
    }

    public void reativar(Integer id) {
        var modelo = modeloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Modelo não encontrado"));
        modelo.setIsAtivo(true);
        modeloRepository.save(modelo);
        log.info("[MODELO] Modelo ID {} foi reativado.", id);
    }

    private ModeloDTO toDTO(Modelo m) {
        return new ModeloDTO(
                m.getIdModelo(),
                m.getNomeModelo(),
                m.getDominioAlvo(),
                m.getRemetenteFalso(),
                m.getAssuntoPadrao(),
                m.getData(),
                m.getTextoHtml(),
                m.getIsAtivo()
        );
    }
}