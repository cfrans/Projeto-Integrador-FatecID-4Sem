-- Inserts padrão — preencher quando definido
-- Exemplos esperados: tipos de acesso, setores iniciais, usuário admin padrão

INSERT INTO tipo_acesso (tipo_acesso) VALUES ('Admin'), ('Colaborador');

INSERT INTO usuario_sistema (nome, email, senha_hash, id_tipo_acesso, primeiro_acesso)
VALUES ('Admin', 'admin@nemo.com', '$2a$12$pSMpOQkPB9fYABIBxSCzEuWl6Q6HYlMFMTZxkm9c8fVSZFBvnWqPG', 1, TRUE);
