package com.nemo.api.simulacao;

/**
 * Representa um e-mail "recebido" na caixa de entrada simulada de uma campanha.
 * O corpo já vem com os placeholders substituídos pelos links reais de rastreamento.
 */
public record InboxEmailDTO(
        Integer idDisparo,
        String remetente,
        String assunto,
        String nomeDestinatario,
        String emailDestinatario,
        String corpoHtml,
        String linkClique,
        String linkAnexo,
        String nomeAnexo,
        String token,
        Boolean clicouLink,
        Boolean abriuAnexo,
        Boolean reportouPhishing
) {}
