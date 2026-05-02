package com.nemo.api.pontuacao;

public enum TipoEvento {
    CLIQUE_LINK(-20),
    ABRIU_ANEXO(-30),
    REPORTE_PHISHING(30),
    TREINAMENTO(50);

    private final int delta;

    TipoEvento(int delta) {
        this.delta = delta;
    }

    public int getDelta() {
        return delta;
    }
}
