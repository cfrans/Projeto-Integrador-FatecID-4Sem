package com.nemo.api.usuario;

import com.nemo.api.config.exception.ResourceNotFoundException;
import com.nemo.api.model.UsuarioDestino;
import com.nemo.api.pontuacao.PontuacaoService;
import com.nemo.api.repository.SetorRepository;
import com.nemo.api.repository.TipoAcessoRepository;
import com.nemo.api.repository.UsuarioDestinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
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
        usuario.setPontuacao(PontuacaoService.SALDO_INICIAL);
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

    // ─── Importação por CSV ───────────────────────────────────────────────────
    public ImportResultDTO importarCsv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo CSV vazio.");
        }

        int total = 0;
        int criados = 0;
        int ignorados = 0;
        List<String> erros = new ArrayList<>();

        var tipoAcesso = tipoAcessoRepository.findById(2)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de acesso não encontrado"));

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String headerLine = reader.readLine();
            if (headerLine == null) {
                throw new IllegalArgumentException("CSV sem cabeçalho.");
            }
            if (headerLine.startsWith("﻿")) headerLine = headerLine.substring(1);

            char sep = headerLine.contains(";") ? ';' : ',';
            List<String> header = parseCsvLine(headerLine, sep).stream()
                    .map(s -> s.toLowerCase().trim())
                    .toList();

            int idxMatricula = header.indexOf("matricula");
            int idxNome = header.indexOf("nome");
            int idxEmail = header.indexOf("email");
            int idxSetor = header.indexOf("setor");

            if (idxMatricula < 0 || idxNome < 0 || idxEmail < 0 || idxSetor < 0) {
                throw new IllegalArgumentException(
                        "Cabeçalho inválido. Esperado: matricula, nome, email, setor.");
            }

            int maxIdx = Math.max(Math.max(idxMatricula, idxNome), Math.max(idxEmail, idxSetor));
            String line;
            int lineNum = 1;

            while ((line = reader.readLine()) != null) {
                lineNum++;
                if (line.isBlank()) continue;
                total++;

                try {
                    List<String> cols = parseCsvLine(line, sep);
                    if (cols.size() <= maxIdx) {
                        erros.add("Linha " + lineNum + ": colunas insuficientes.");
                        continue;
                    }

                    String matriculaStr = cols.get(idxMatricula).trim();
                    String nome = cols.get(idxNome).trim();
                    String email = cols.get(idxEmail).trim();
                    String nomeSetor = cols.get(idxSetor).trim();

                    if (matriculaStr.isEmpty() || nome.isEmpty() || email.isEmpty() || nomeSetor.isEmpty()) {
                        erros.add("Linha " + lineNum + ": campos obrigatórios em branco.");
                        continue;
                    }

                    Integer matricula;
                    try {
                        matricula = Integer.parseInt(matriculaStr);
                    } catch (NumberFormatException e) {
                        erros.add("Linha " + lineNum + ": matrícula inválida (\"" + matriculaStr + "\").");
                        continue;
                    }

                    var setor = setorRepository.findByNomeSetorIgnoreCase(nomeSetor).orElse(null);
                    if (setor == null) {
                        erros.add("Linha " + lineNum + ": setor \"" + nomeSetor + "\" não encontrado.");
                        continue;
                    }

                    if (repository.existsByMatricula(matricula) || repository.existsByEmail(email)) {
                        ignorados++;
                        continue;
                    }

                    var usuario = new UsuarioDestino();
                    usuario.setMatricula(matricula);
                    usuario.setNome(nome);
                    usuario.setEmail(email);
                    usuario.setSenhaHash(passwordEncoder.encode(String.valueOf(matricula)));
                    usuario.setPontuacao(PontuacaoService.SALDO_INICIAL);
                    usuario.setPrimeiroAcesso(true);
                    usuario.setSetor(setor);
                    usuario.setTipoAcesso(tipoAcesso);
                    repository.save(usuario);
                    criados++;

                } catch (Exception e) {
                    erros.add("Linha " + lineNum + ": " + e.getMessage());
                }
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Erro ao ler o arquivo: " + e.getMessage());
        }

        return new ImportResultDTO(total, criados, ignorados, erros);
    }

    private List<String> parseCsvLine(String line, char sep) {
        List<String> fields = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    current.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == sep && !inQuotes) {
                fields.add(current.toString());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        fields.add(current.toString());
        return fields;
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
