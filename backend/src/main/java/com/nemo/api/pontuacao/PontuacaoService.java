package com.nemo.api.pontuacao;

import com.nemo.api.model.Campanha;
import com.nemo.api.model.Disparo;
import com.nemo.api.model.PontuacaoEvento;
import com.nemo.api.model.UsuarioDestino;
import com.nemo.api.repository.PontuacaoEventoRepository;
import com.nemo.api.repository.UsuarioDestinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PontuacaoService {

    public static final int SALDO_MIN     = 0;
    public static final int SALDO_MAX     = 1000;
    public static final int SALDO_INICIAL = 500;

    private final PontuacaoEventoRepository pontuacaoEventoRepository;
    private final UsuarioDestinoRepository usuarioDestinoRepository;

    @Transactional
    public void aplicarEventoDisparo(Disparo disparo, TipoEvento tipo) {
        if (disparo == null || disparo.getUsuarioDestino() == null) return;

        if (pontuacaoEventoRepository.existsByDisparo_IdDisparoAndTipoEvento(
                disparo.getIdDisparo(), tipo)) {
            return;
        }

        UsuarioDestino alvo = disparo.getUsuarioDestino();
        Campanha campanha = disparo.getCampanha();

        int saldoAntes = alvo.getPontuacao() != null ? alvo.getPontuacao() : SALDO_INICIAL;
        int saldoApos  = clamp(saldoAntes + tipo.getDelta());
        int deltaReal  = saldoApos - saldoAntes;

        PontuacaoEvento evento = new PontuacaoEvento();
        evento.setUsuarioDestino(alvo);
        evento.setDisparo(disparo);
        evento.setCampanha(campanha);
        evento.setTipoEvento(tipo);
        evento.setDelta(deltaReal);
        evento.setSaldoApos(saldoApos);
        pontuacaoEventoRepository.save(evento);

        alvo.setPontuacao(saldoApos);
        usuarioDestinoRepository.save(alvo);
    }

    @Transactional
    public void aplicarEventoTreinamento(UsuarioDestino alvo, String codigoCurso) {
        if (alvo == null || codigoCurso == null) return;

        if (pontuacaoEventoRepository
                .existsByUsuarioDestino_IdUsuarioDestinoAndTipoEventoAndReferenciaExterna(
                        alvo.getIdUsuarioDestino(), TipoEvento.TREINAMENTO, codigoCurso)) {
            return;
        }

        int saldoAntes = alvo.getPontuacao() != null ? alvo.getPontuacao() : SALDO_INICIAL;
        int saldoApos  = clamp(saldoAntes + TipoEvento.TREINAMENTO.getDelta());
        int deltaReal  = saldoApos - saldoAntes;

        PontuacaoEvento evento = new PontuacaoEvento();
        evento.setUsuarioDestino(alvo);
        evento.setTipoEvento(TipoEvento.TREINAMENTO);
        evento.setDelta(deltaReal);
        evento.setSaldoApos(saldoApos);
        evento.setReferenciaExterna(codigoCurso);
        pontuacaoEventoRepository.save(evento);

        alvo.setPontuacao(saldoApos);
        usuarioDestinoRepository.save(alvo);
    }

    private int clamp(int valor) {
        return Math.max(SALDO_MIN, Math.min(SALDO_MAX, valor));
    }
}
