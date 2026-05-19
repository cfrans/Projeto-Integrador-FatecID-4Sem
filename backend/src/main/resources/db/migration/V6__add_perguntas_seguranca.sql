CREATE TABLE pergunta_seguranca (
    id_pergunta INT AUTO_INCREMENT PRIMARY KEY,
    texto       VARCHAR(255) NOT NULL,
    grupo       TINYINT      NOT NULL
);

INSERT INTO pergunta_seguranca (texto, grupo) VALUES
('Em que cidade você conheceu seu primeiro cônjuge/parceiro?', 1),
('Qual é o nome do meio da sua mãe?',                          1),
('Qual é o nome da primeira escola que frequentou?',           1),
('Qual foi seu apelido na infância?',                          1),
('Em que país você nasceu?',                                   1),
('Qual é o nome do seu primeiro animal de estimação?',         2),
('Qual é o nome do seu tio favorito?',                         2),
('Qual é o nome do seu primo mais velho?',                     2),
('Qual é o nome do seu filho mais novo?',                      2),
('Onde você passou sua lua-de-mel?',                           2);

ALTER TABLE usuario_destino
    ADD COLUMN id_pergunta_1   INT          NULL,
    ADD COLUMN resposta_hash_1 VARCHAR(255) NULL,
    ADD COLUMN id_pergunta_2   INT          NULL,
    ADD COLUMN resposta_hash_2 VARCHAR(255) NULL,
    ADD CONSTRAINT fk_destino_pergunta_1 FOREIGN KEY (id_pergunta_1) REFERENCES pergunta_seguranca (id_pergunta),
    ADD CONSTRAINT fk_destino_pergunta_2 FOREIGN KEY (id_pergunta_2) REFERENCES pergunta_seguranca (id_pergunta);

ALTER TABLE usuario_sistema
    ADD COLUMN id_pergunta_1   INT          NULL,
    ADD COLUMN resposta_hash_1 VARCHAR(255) NULL,
    ADD COLUMN id_pergunta_2   INT          NULL,
    ADD COLUMN resposta_hash_2 VARCHAR(255) NULL,
    ADD CONSTRAINT fk_sistema_pergunta_1 FOREIGN KEY (id_pergunta_1) REFERENCES pergunta_seguranca (id_pergunta),
    ADD CONSTRAINT fk_sistema_pergunta_2 FOREIGN KEY (id_pergunta_2) REFERENCES pergunta_seguranca (id_pergunta);
