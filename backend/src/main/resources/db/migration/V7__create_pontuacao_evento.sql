CREATE TABLE pontuacao_evento (
    id_pontuacao_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_destino  INT          NOT NULL,
    id_disparo          INT          NULL,
    id_campanha         INT          NULL,
    tipo_evento         VARCHAR(30)  NOT NULL,
    delta               INT          NOT NULL,
    saldo_apos          INT          NOT NULL,
    referencia_externa  VARCHAR(100) NULL,
    criado_em           DATETIME     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evento_usuario  FOREIGN KEY (id_usuario_destino) REFERENCES usuario_destino (id_usuario_destino),
    CONSTRAINT fk_evento_disparo  FOREIGN KEY (id_disparo)         REFERENCES disparos (id_disparo),
    CONSTRAINT fk_evento_campanha FOREIGN KEY (id_campanha)        REFERENCES campanha (id_campanha)
);

CREATE UNIQUE INDEX idx_evento_disparo_tipo ON pontuacao_evento (id_disparo, tipo_evento);
CREATE INDEX idx_evento_usuario_data       ON pontuacao_evento (id_usuario_destino, criado_em);

ALTER TABLE usuario_destino ALTER COLUMN pontuacao SET DEFAULT 500;

UPDATE usuario_destino SET pontuacao = 500 WHERE pontuacao = 0 OR pontuacao IS NULL;
