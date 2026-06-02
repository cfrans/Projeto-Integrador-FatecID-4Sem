package com.nemo.api.simulacao;

import com.nemo.api.model.Campanha;
import com.nemo.api.model.Disparo;
import com.nemo.api.repository.DisparoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Monta a "caixa de entrada" simulada usada como Plano B offline na apresentação:
 * reconstrói os e-mails que teriam sido enviados (mesma substituição de placeholders
 * do {@code EmailService}), apontando os links para os endpoints reais de tracking.
 * Só considera os usuários de teste (is_real), evitando o ruído dos alvos mock.
 */
@Service
@RequiredArgsConstructor
public class SimulacaoService {

    private final DisparoRepository disparoRepository;

    @Value("${nemo.tracking.base-url}")
    private String trackingBaseUrl;

    public List<InboxEmailDTO> listarInbox(Integer idCampanha) {
        return disparoRepository.findByCampanha_IdCampanha(idCampanha).stream()
                .filter(d -> d.getUsuarioDestino() != null
                        && Boolean.TRUE.equals(d.getUsuarioDestino().getIsReal()))
                .map(this::toInbox)
                .toList();
    }

    private InboxEmailDTO toInbox(Disparo d) {
        Campanha campanha = d.getCampanha();
        String token = d.getTokenUnico();
        String nomeAlvo = d.getUsuarioDestino().getNome();

        String linkClique = trackingBaseUrl + "/confirmar/" + token;
        String linkAnexo  = trackingBaseUrl + "/doc/" + token;

        String corpoHtml = campanha.getModelo().getTextoHtml()
                .replace("{{LINK_AQUI}}", linkClique)
                .replace("{{LINK_ANEXO}}", linkAnexo)
                .replace("{{NOME_ALVO}}", nomeAlvo);

        String nomeAnexo = (campanha.getNomeAnexo() != null && !campanha.getNomeAnexo().isBlank())
                ? campanha.getNomeAnexo()
                : null;

        return new InboxEmailDTO(
                d.getIdDisparo(),
                campanha.getModelo().getRemetenteFalso(),
                campanha.getAssuntoEmail(),
                nomeAlvo,
                d.getUsuarioDestino().getEmail(),
                corpoHtml,
                linkClique,
                linkAnexo,
                nomeAnexo,
                token,
                d.getClicouLink(),
                d.getAbriuAnexo(),
                d.getReportouPhishing()
        );
    }
}
