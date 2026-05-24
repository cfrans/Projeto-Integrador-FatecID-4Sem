package com.nemo.api.treinamento;

import com.nemo.api.auth.JwtService;
import com.nemo.api.config.exception.ResourceNotFoundException;
import com.nemo.api.model.*;
import com.nemo.api.model.dto.*;
import com.nemo.api.repository.*;
import com.nemo.api.pontuacao.PontuacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreinamentoService {

    private final TreinamentoRepository treinamentoRepository;
    private final TreinamentoConcluidoRepository treinamentoConcluidoRepository;
    private final UsuarioDestinoRepository usuarioDestinoRepository;
    private final JwtService jwtService;
    private final PontuacaoService pontuacaoService;

    public List<TreinamentoDTO> listarTreinamentosComStatus(String token) {
        String email = jwtService.extractEmail(token);
        var usuarioDestino = usuarioDestinoRepository.findByEmail(email).orElse(null);

        List<Treinamento> treinamentos = treinamentoRepository.findAllByOrderByCriadoEmDesc();

        return treinamentos.stream().map(t -> {
            boolean concluido = false;
            if (usuarioDestino != null) {
                concluido = treinamentoConcluidoRepository
                        .existsByUsuarioDestino_IdUsuarioDestinoAndTreinamento_IdTreinamento(
                                usuarioDestino.getIdUsuarioDestino(), t.getIdTreinamento());
            }

            String youtubeId = null;
            Integer duracaoMinutos = null;
            String nivel = null;
            String corTema = null;
            List<QuizPerguntaDTO> perguntas = null;

            if (t instanceof TreinamentoVideo tv) {
                youtubeId = tv.getYoutubeId();
                duracaoMinutos = tv.getDuracaoMinutos();
            } else if (t instanceof TreinamentoQuiz tq) {
                nivel = tq.getNivel();
                corTema = tq.getCorTema();
                if (tq.getPerguntas() != null) {
                    perguntas = tq.getPerguntas().stream().map(p -> new QuizPerguntaDTO(
                            p.getIdPergunta(),
                            p.getEnunciado(),
                            p.getExplicacao(),
                            p.getOpcoes() != null ? p.getOpcoes().stream().map(o -> new QuizOpcaoDTO(
                                    o.getIdOpcao(), o.getTexto(), o.getIsCorreta()
                            )).toList() : List.of()
                    )).toList();
                }
            }

            return new TreinamentoDTO(
                    t.getIdTreinamento(),
                    t.getTipo(),
                    t.getTitulo(),
                    t.getDescricao(),
                    t.getCategoria(),
                    t.getPontos(),
                    concluido,
                    youtubeId,
                    duracaoMinutos,
                    nivel,
                    corTema,
                    perguntas
            );
        }).collect(Collectors.toList());
    }

    public void concluirTreinamento(Integer idTreinamento, String token) {
        String email = jwtService.extractEmail(token);
        var usuarioDestino = usuarioDestinoRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        var treinamento = treinamentoRepository.findById(idTreinamento)
                .orElseThrow(() -> new ResourceNotFoundException("Treinamento não encontrado"));

        boolean jaConcluiu = treinamentoConcluidoRepository
                .existsByUsuarioDestino_IdUsuarioDestinoAndTreinamento_IdTreinamento(
                        usuarioDestino.getIdUsuarioDestino(), idTreinamento);

        if (jaConcluiu) {
            return; // Idempotente, não gera erro nem pontua de novo
        }

        TreinamentoConcluido tc = new TreinamentoConcluido();
        tc.setUsuarioDestino(usuarioDestino);
        tc.setTreinamento(treinamento);
        treinamentoConcluidoRepository.save(tc);

        // Pontuar
        // O PontuacaoService atual pode estar preparado pra string (codigoCurso), vamos adaptar para string ID
        pontuacaoService.aplicarEventoTreinamento(usuarioDestino, String.valueOf(idTreinamento));
    }
}
