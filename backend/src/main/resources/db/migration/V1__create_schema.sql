CREATE TABLE tipo_acesso (
    id_tipo_acesso INT AUTO_INCREMENT PRIMARY KEY,
    tipo_acesso    VARCHAR(50) NOT NULL
);

CREATE TABLE usuario_sistema (
    id_usuario_sistema INT AUTO_INCREMENT PRIMARY KEY,
    nome               VARCHAR(100) NOT NULL,
    email              VARCHAR(100) NOT NULL UNIQUE,
    senha_hash         VARCHAR(255) NOT NULL,
    id_tipo_acesso     INT          NOT NULL,
    primeiro_acesso    BOOLEAN      DEFAULT TRUE,
    CONSTRAINT fk_tipo_acesso FOREIGN KEY (id_tipo_acesso) REFERENCES tipo_acesso (id_tipo_acesso)
);

CREATE TABLE setor (
    id_setor    INT AUTO_INCREMENT PRIMARY KEY,
    nome_setor  VARCHAR(50) NOT NULL
);

CREATE TABLE usuario_destino (
    id_usuario_destino INT AUTO_INCREMENT PRIMARY KEY,
    matricula          INT          NOT NULL UNIQUE,
    nome               VARCHAR(100) NOT NULL,
    email              VARCHAR(100) NOT NULL UNIQUE,
    senha_hash         VARCHAR(255) NOT NULL,
    pontuacao          INT          DEFAULT 0,
    id_setor           INT          NOT NULL,
    CONSTRAINT fk_setor FOREIGN KEY (id_setor) REFERENCES setor (id_setor)
);

CREATE TABLE modelo (
    id_modelo        INT AUTO_INCREMENT PRIMARY KEY,
    nome_modelo      VARCHAR(50)  NOT NULL,
    dominio_alvo     VARCHAR(100) NOT NULL,
    remetente_falso  VARCHAR(100) NOT NULL,
    assunto_padrao   VARCHAR(150) NOT NULL,
    data             DATETIME     DEFAULT CURRENT_TIMESTAMP,
    texto_html       TEXT         NOT NULL,
    id_usuario_sistema INT        NOT NULL,
    CONSTRAINT fk_modelo_usuario FOREIGN KEY (id_usuario_sistema) REFERENCES usuario_sistema (id_usuario_sistema)
);

CREATE TABLE campanha (
    id_campanha        INT AUTO_INCREMENT PRIMARY KEY,
    nome_campanha      VARCHAR(100) NOT NULL,
    assunto_email      VARCHAR(150),
    nome_anexo         VARCHAR(100),
    status_envio       VARCHAR(50)  DEFAULT 'Pendente',
    data_criacao       DATETIME     DEFAULT CURRENT_TIMESTAMP,
    id_modelo          INT          NOT NULL,
    id_usuario_sistema INT          NOT NULL,
    CONSTRAINT fk_campanha_modelo  FOREIGN KEY (id_modelo)          REFERENCES modelo (id_modelo),
    CONSTRAINT fk_campanha_usuario FOREIGN KEY (id_usuario_sistema) REFERENCES usuario_sistema (id_usuario_sistema)
);

CREATE TABLE setor_campanha (
    id_setor_campanha INT AUTO_INCREMENT PRIMARY KEY,
    id_campanha       INT NOT NULL,
    id_setor          INT NOT NULL,
    CONSTRAINT fk_sc_campanha FOREIGN KEY (id_campanha) REFERENCES campanha (id_campanha),
    CONSTRAINT fk_sc_setor    FOREIGN KEY (id_setor)    REFERENCES setor (id_setor)
);

CREATE TABLE disparos (
    id_disparo         INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_destino INT          NOT NULL,
    id_campanha        INT          NOT NULL,
    token_unico        VARCHAR(255) NOT NULL UNIQUE,
    abriu_email        BOOLEAN      DEFAULT FALSE,
    clicou_link        BOOLEAN      DEFAULT FALSE,
    abriu_anexo        BOOLEAN      DEFAULT FALSE,
    reportou_phishing  BOOLEAN      DEFAULT FALSE,
    data_envio         DATETIME     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_disparo_usuario  FOREIGN KEY (id_usuario_destino) REFERENCES usuario_destino (id_usuario_destino),
    CONSTRAINT fk_disparo_campanha FOREIGN KEY (id_campanha)        REFERENCES campanha (id_campanha)
);

CREATE TABLE treinamento_concluido (
    id_treinamento_concluido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_destino       INT         NOT NULL,
    codigo_curso             VARCHAR(50) NOT NULL,
    data_conclusao           DATETIME    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_treinamento_usuario FOREIGN KEY (id_usuario_destino) REFERENCES usuario_destino (id_usuario_destino)
);
