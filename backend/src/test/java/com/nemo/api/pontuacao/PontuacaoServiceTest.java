package com.nemo.api.pontuacao;

import com.nemo.api.model.Campanha;
import com.nemo.api.model.Disparo;
import com.nemo.api.model.PontuacaoEvento;
import com.nemo.api.model.UsuarioDestino;
import com.nemo.api.repository.PontuacaoEventoRepository;
import com.nemo.api.repository.UsuarioDestinoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

/**
 * Testes de unidade do {@link PontuacaoService} — repositórios mockados,
 * sem contexto Spring nem banco. Cobre deltas, clamp (0–1000) e idempotência.
 */
@ExtendWith(MockitoExtension.class)
class PontuacaoServiceTest {

    @Mock
    private PontuacaoEventoRepository pontuacaoEventoRepository;
    @Mock
    private UsuarioDestinoRepository usuarioDestinoRepository;
    @InjectMocks
    private PontuacaoService pontuacaoService;

    private Disparo disparoComSaldo(int saldo) {
        UsuarioDestino alvo = new UsuarioDestino();
        alvo.setPontuacao(saldo);
        Disparo disparo = new Disparo();
        disparo.setIdDisparo(1);
        disparo.setUsuarioDestino(alvo);
        disparo.setCampanha(new Campanha());
        return disparo;
    }

    @Test
    void clique_no_link_aplica_penalidade_de_20() {
        Disparo disparo = disparoComSaldo(500);
        when(pontuacaoEventoRepository.existsByDisparo_IdDisparoAndTipoEvento(1, TipoEvento.CLIQUE_LINK))
                .thenReturn(false);

        pontuacaoService.aplicarEventoDisparo(disparo, TipoEvento.CLIQUE_LINK);

        ArgumentCaptor<PontuacaoEvento> captor = ArgumentCaptor.forClass(PontuacaoEvento.class);
        verify(pontuacaoEventoRepository).save(captor.capture());
        assertEquals(-20, captor.getValue().getDelta());
        assertEquals(480, captor.getValue().getSaldoApos());
        assertEquals(480, disparo.getUsuarioDestino().getPontuacao());
    }

    @Test
    void evento_duplicado_no_mesmo_disparo_e_ignorado() {
        Disparo disparo = disparoComSaldo(500);
        when(pontuacaoEventoRepository.existsByDisparo_IdDisparoAndTipoEvento(1, TipoEvento.CLIQUE_LINK))
                .thenReturn(true);

        pontuacaoService.aplicarEventoDisparo(disparo, TipoEvento.CLIQUE_LINK);

        verify(pontuacaoEventoRepository, never()).save(any());
        verify(usuarioDestinoRepository, never()).save(any());
    }

    @Test
    void saldo_nao_fica_negativo_clamp_inferior() {
        Disparo disparo = disparoComSaldo(10);
        when(pontuacaoEventoRepository.existsByDisparo_IdDisparoAndTipoEvento(anyInt(), any()))
                .thenReturn(false);

        pontuacaoService.aplicarEventoDisparo(disparo, TipoEvento.ABRIU_ANEXO); // -30

        ArgumentCaptor<PontuacaoEvento> captor = ArgumentCaptor.forClass(PontuacaoEvento.class);
        verify(pontuacaoEventoRepository).save(captor.capture());
        assertEquals(0, captor.getValue().getSaldoApos());
        assertEquals(-10, captor.getValue().getDelta()); // delta real após o clamp
    }

    @Test
    void treinamento_nao_passa_de_1000_clamp_superior() {
        UsuarioDestino alvo = new UsuarioDestino();
        alvo.setIdUsuarioDestino(7);
        alvo.setPontuacao(990);
        when(pontuacaoEventoRepository
                .existsByUsuarioDestino_IdUsuarioDestinoAndTipoEventoAndReferenciaExterna(
                        7, TipoEvento.TREINAMENTO, "quiz-1"))
                .thenReturn(false);

        pontuacaoService.aplicarEventoTreinamento(alvo, "quiz-1"); // +50

        ArgumentCaptor<PontuacaoEvento> captor = ArgumentCaptor.forClass(PontuacaoEvento.class);
        verify(pontuacaoEventoRepository).save(captor.capture());
        assertEquals(1000, captor.getValue().getSaldoApos());
        assertEquals(10, captor.getValue().getDelta());
        assertEquals(1000, alvo.getPontuacao());
    }

    @Test
    void disparo_nulo_nao_faz_nada() {
        pontuacaoService.aplicarEventoDisparo(null, TipoEvento.CLIQUE_LINK);
        verifyNoInteractions(pontuacaoEventoRepository, usuarioDestinoRepository);
    }
}
