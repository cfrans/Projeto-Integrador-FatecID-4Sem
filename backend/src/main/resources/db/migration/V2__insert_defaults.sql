-- Inserts padrão — preencher quando definido
-- Exemplos esperados: tipos de acesso, setores iniciais, usuário admin padrão

INSERT INTO tipo_acesso (tipo_acesso) VALUES ('Admin'), ('Colaborador');

INSERT INTO usuario_sistema (nome, email, senha_hash, id_tipo_acesso, primeiro_acesso)
VALUES ('Admin', 'admin@nemo.com', '$2a$10$zEJv29zRIPKVGr8O03XXieZTZFxYpdRZoR42UVtG0xezNMYvSCO0y', 1, TRUE);
