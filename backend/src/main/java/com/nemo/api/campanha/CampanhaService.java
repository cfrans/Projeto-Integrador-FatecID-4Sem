package com.nemo.api.campanha;

import com.nemo.api.auth.JwtService;
import com.nemo.api.config.exception.ResourceNotFoundException;
import com.nemo.api.email.EmailService;
import com.nemo.api.model.Campanha;
import com.nemo.api.model.Disparo;
import com.nemo.api.model.UsuarioDestino;
import com.nemo.api.repository.*;
import com.nemo.api.setor.SetorDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Sort;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CampanhaService {

    private final CampanhaRepository campanhaRepository;
    private final ModeloRepository modeloRepository;
    private final SetorRepository setorRepository;
    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final UsuarioDestinoRepository usuarioDestinoRepository;
    private final DisparoRepository disparoRepository;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Value("${nemo.csv-dir}")
    private String csvDir;

    @Value("${nemo.email.enabled}")
    private boolean emailEnabled;

    public List<CampanhaDTO> listar() {
        return campanhaRepository.findAllWithModeloAndSetores().stream().map(this::toDTO).toList();
    }

    public CampanhaDTO criar(CampanhaRequest request, String token) {
        String email = jwtService.extractEmail(token);
        var usuario = usuarioSistemaRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        var modelo = modeloRepository.findById(request.idModelo())
                .orElseThrow(() -> new ResourceNotFoundException("Modelo não encontrado"));
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

        Campanha campanhasSalva = campanhaRepository.save(campanha);

        // Busca os usuários dos setores selecionados e gera os tokens (FILTRANDO ADMINS)
        List<UsuarioDestino> alvos = request.idSetores().isEmpty()
                ? usuarioDestinoRepository.findAll(Sort.unsorted())
                : usuarioDestinoRepository.findBySetor_IdSetorIn(request.idSetores());

        // Remove da lista os usuários que têm tipo de acesso 1 (Admin) e usuários inativos
        alvos = alvos.stream()
                .filter(a -> a.getTipoAcesso().getIdTipoAcesso() != 1)
                .filter(a -> a.getIsAtivo() != null && a.getIsAtivo())
                .toList();

        try {
            log.info("[CAMPANHA] Iniciando geração de tokens e disparos para a campanha ID {} com {} alvos.", campanhasSalva.getIdCampanha(), alvos.size());
            processarGeracaoDeTokens(campanhasSalva.getIdCampanha(), alvos);
        } catch (Exception e) {
            log.error("[CAMPANHA] Erro ao gerar tokens para campanha {}: {}", campanhasSalva.getIdCampanha(), e.getMessage());
            throw new RuntimeException("Campanha salva, mas erro ao gerar tokens: " + e.getMessage());
        }

        log.info("[CAMPANHA] Campanha ID {} criada com sucesso pelo usuário {}.", campanhasSalva.getIdCampanha(), email);
        return toDTO(campanhasSalva);
    }

    public void deletar(Integer id) {
        campanhaRepository.deleteById(id);
    }

    public List<DisparoDTO> listarDisparos(Integer idCampanha,
                                           Boolean clicouLink,
                                           Boolean abriuAnexo,
                                           Boolean reportouPhishing) {
        return disparoRepository.findByCampanha_IdCampanha(idCampanha).stream()
                .filter(d -> clicouLink      == null || d.getClicouLink().equals(clicouLink))
                .filter(d -> abriuAnexo     == null || d.getAbriuAnexo().equals(abriuAnexo))
                .filter(d -> reportouPhishing == null || d.getReportouPhishing().equals(reportouPhishing))
                .map(this::toDisparoDTO)
                .toList();
    }

    private DisparoDTO toDisparoDTO(Disparo d) {
        return new DisparoDTO(
                d.getIdDisparo(),
                d.getUsuarioDestino().getNome(),
                d.getUsuarioDestino().getEmail(),
                d.getUsuarioDestino().getSetor().getNomeSetor(),
                d.getUsuarioDestino().getPontuacao(),
                d.getClicouLink(),
                d.getAbriuAnexo(),
                d.getReportouPhishing(),
                d.getDataEnvio()
        );
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

    public void processarGeracaoDeTokens(Integer idCampanha, List<UsuarioDestino> alvos) throws Exception {
        Path tokensDir = Paths.get(csvDir).toAbsolutePath();
        Files.createDirectories(tokensDir);

        Path arquivoTemp  = tokensDir.resolve("alvos_temp_" + idCampanha + ".csv");
        Path arquivoSaida = tokensDir.resolve("disparos_campanha_" + idCampanha + ".csv");

        // 1. Criar o arquivo CSV temporário
        try (PrintWriter writer = new PrintWriter(arquivoTemp.toFile())) {
            writer.println("matricula,nome,email,departamento");
            for (UsuarioDestino alvo : alvos) {
                writer.printf("%d,%s,%s,%s\n",
                        alvo.getMatricula(),
                        alvo.getNome(),
                        alvo.getEmail(),
                        alvo.getSetor().getNomeSetor());
            }
        }

        // 2. Acionar o Worker em C (working dir = tokensDir, para o output cair lá)
        boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
        String workerName = isWindows ? "gerador_tokens_worker.exe" : "gerador_tokens_worker";
        Path workerPath = Paths.get(System.getProperty("user.dir"), "scripts", workerName).toAbsolutePath();

        ProcessBuilder pb = new ProcessBuilder(
                workerPath.toString(),
                arquivoTemp.toString(),
                String.valueOf(idCampanha));
        pb.directory(tokensDir.toFile());
        pb.inheritIO();

        Process process = pb.start();

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Ocorreu um erro no Worker C. Código de saída: " + exitCode);
        }

        // 3. Ler o CSV com os tokens e criar os disparos
        List<String> linhasResultado = Files.readAllLines(arquivoSaida);

        // Resolve a campanha UMA vez antes do loop (antes: findById por iteração)
        Campanha campanha = campanhaRepository.findById(idCampanha).orElseThrow();

        // Monta um mapa email→usuário para evitar findByEmail dentro do loop
        var mapaAlvos = alvos.stream()
                .collect(java.util.stream.Collectors.toMap(UsuarioDestino::getEmail, a -> a));

        List<Disparo> disparosParaSalvar = new java.util.ArrayList<>();

        for (int i = 1; i < linhasResultado.size(); i++) {
            String[] colunas = linhasResultado.get(i).split(",");
            if (colunas.length < 5) { log.warn("[CAMPANHA] Linha CSV malformada ignorada: {}", linhasResultado.get(i)); continue; }
            String emailAlvo  = colunas[1];
            String tokenUnico = colunas[4];

            UsuarioDestino alvo = mapaAlvos.get(emailAlvo);
            if (alvo == null) continue;

            var disparo = new Disparo();
            disparo.setTokenUnico(tokenUnico);
            disparo.setDataEnvio(LocalDateTime.now());
            disparo.setUsuarioDestino(alvo);
            disparo.setCampanha(campanha);
            disparosParaSalvar.add(disparo);
        }

        // Salva todos os disparos de uma vez (antes: save individual por linha)
        List<Disparo> disparosSalvos = disparoRepository.saveAll(disparosParaSalvar);

        // Dispara e-mails após persistir
        for (Disparo disparo : disparosSalvos) {
            UsuarioDestino alvo = disparo.getUsuarioDestino();
            boolean real = Boolean.TRUE.equals(alvo.getIsReal());
            if (real && emailEnabled) {
                emailService.enviarEmailPhishing(disparo);
            } else if (real && !emailEnabled) {
                System.out.println("[SIMULAÇÃO] Modo Offline: E-mail seria enviado para " + alvo.getEmail());
            } else {
                System.out.println("[MOCK] Usuário de volume: Disparo registrado apenas para estatísticas (" + alvo.getEmail() + ")");
            }
        }

        // 4. Atualizar status da campanha para Concluído
        var campanhaFinalizada = campanhaRepository.findById(idCampanha).orElseThrow();
        campanhaFinalizada.setStatusEnvio("Concluído");
        campanhaRepository.save(campanhaFinalizada);

        // 5. LIMPEZA: Excluir os CSVs temporários
        Files.deleteIfExists(arquivoTemp);
        Files.deleteIfExists(arquivoSaida);
    }

}