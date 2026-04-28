package com.nemo.api.campanha;

import com.nemo.api.auth.JwtService;
import com.nemo.api.config.exception.ResourceNotFoundException;
import com.nemo.api.model.Campanha;
import com.nemo.api.model.Disparo;
import com.nemo.api.model.UsuarioDestino;
import com.nemo.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

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

    public List<CampanhaDTO> listar() {
        return campanhaRepository.findAll().stream().map(this::toDTO).toList();
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

        // Busca os usuários dos setores selecionados e gera os tokens
        List<UsuarioDestino> alvos = request.idSetores().isEmpty()
                ? usuarioDestinoRepository.findAll()
                : usuarioDestinoRepository.findBySetor_IdSetorIn(request.idSetores());

        try {
            processarGeracaoDeTokens(campanhasSalva.getIdCampanha(), alvos);
        } catch (Exception e) {
            throw new RuntimeException("Campanha salva, mas erro ao gerar tokens: " + e.getMessage());
        }

        return toDTO(campanhasSalva);
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

    public void processarGeracaoDeTokens(Integer idCampanha, List<UsuarioDestino> alvos) throws Exception {
        String baseDir = System.getProperty("user.dir");
        String nomeArquivoTemp  = baseDir + File.separator + "alvos_temp_" + idCampanha + ".csv";
        String nomeArquivoSaida = baseDir + File.separator + "disparos_campanha_" + idCampanha + ".csv";

        // 1. Criar o arquivo CSV temporário
        try (PrintWriter writer = new PrintWriter(new File(nomeArquivoTemp))) {
            writer.println("matricula,nome,email,departamento");
            for (UsuarioDestino alvo : alvos) {
                writer.printf("%d,%s,%s,%s\n",
                        alvo.getMatricula(),
                        alvo.getNome(),
                        alvo.getEmail(),
                        alvo.getSetor().getNomeSetor());
            }
        }

        // 2. Acionar o Worker em C
        boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
        String caminhoWorker = isWindows ? "scripts/gerador_tokens_worker.exe" : "scripts/gerador_tokens_worker";

        ProcessBuilder pb = new ProcessBuilder(caminhoWorker, nomeArquivoTemp, String.valueOf(idCampanha));
        pb.directory(new File(System.getProperty("user.dir")));
        pb.inheritIO();

        Process process = pb.start();

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Ocorreu um erro no Worker C. Código de saída: " + exitCode);
        }

        // 3. Ler o CSV com os tokens
        List<String> linhasResultado = Files.readAllLines(Path.of(nomeArquivoSaida));

        for (int i = 1; i < linhasResultado.size(); i++) {
            String[] colunas = linhasResultado.get(i).split(",");
            String emailAlvo  = colunas[1];
            String tokenUnico = colunas[4];

            usuarioDestinoRepository.findByEmail(emailAlvo).ifPresent(alvo -> {
                var disparo = new Disparo();
                disparo.setTokenUnico(tokenUnico);
                disparo.setDataEnvio(LocalDateTime.now());
                disparo.setUsuarioDestino(alvo);
                disparo.setCampanha(campanhaRepository.findById(idCampanha).orElseThrow());
                disparoRepository.save(disparo);
            });
        }

        // 4. LIMPEZA: Excluir os CSVs temporários
        Files.deleteIfExists(Path.of(nomeArquivoTemp));
        Files.deleteIfExists(Path.of(nomeArquivoSaida));
    }

    // Método temporário para testar o C via PowerShell
    public String testarWorkerC() throws Exception {
        Integer idCampanha = 999;
        String baseDir = System.getProperty("user.dir");
        String nomeArquivoTemp  = baseDir + File.separator + "alvos_temp_" + idCampanha + ".csv";
        String nomeArquivoSaida = baseDir + File.separator + "disparos_campanha_" + idCampanha + ".csv";

        // 1. Gera um CSV falso com 2 usuários
        try (PrintWriter writer = new PrintWriter(new File(nomeArquivoTemp))) {
            writer.println("matricula,nome,email,departamento");
            writer.println("1001,Caio,caio@fatec.edu.br,TI");
            writer.println("1002,Professor,mome@fatec.edu.br,Diretoria");
        }

        // 2. Aciona o Worker
        boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
        String caminhoWorker = isWindows ? "scripts/gerador_tokens_worker.exe" : "scripts/gerador_tokens_worker";

        ProcessBuilder pb = new ProcessBuilder(caminhoWorker, nomeArquivoTemp, String.valueOf(idCampanha));
        pb.directory(new File(System.getProperty("user.dir")));
        pb.inheritIO();
        Process process = pb.start();

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            return "Erro! O C retornou o código: " + exitCode;
        }

        // Não vamos deletar os arquivos para você poder ver eles na sua pasta!
        return "Sucesso! Verifique a pasta backend/ e veja se o arquivo " + nomeArquivoSaida + " foi criado com os tokens.";
    }

}