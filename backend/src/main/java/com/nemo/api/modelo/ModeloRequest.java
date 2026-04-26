package com.nemo.api.modelo;

public record ModeloRequest(
        String nomeModelo,
        String dominioAlvo,
        String remetenteFalso,
        String assuntoPadrao,
        String textoHtml
) {}