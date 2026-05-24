CREATE TABLE treinamento (
    id_treinamento INT AUTO_INCREMENT PRIMARY KEY,
    tipo           VARCHAR(20) NOT NULL, -- 'VIDEO' ou 'QUIZ'
    titulo         VARCHAR(150) NOT NULL,
    descricao      TEXT,
    categoria      VARCHAR(50) NOT NULL,
    pontos         INT DEFAULT 50,
    criado_em      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE treinamento_video (
    id_treinamento INT PRIMARY KEY,
    youtube_id     VARCHAR(50) NOT NULL,
    duracao_minutos INT NOT NULL,
    CONSTRAINT fk_video_treinamento FOREIGN KEY (id_treinamento) REFERENCES treinamento (id_treinamento) ON DELETE CASCADE
);

CREATE TABLE treinamento_quiz (
    id_treinamento INT PRIMARY KEY,
    nivel          VARCHAR(50) NOT NULL,
    cor_tema       VARCHAR(50) NOT NULL,
    CONSTRAINT fk_quiz_treinamento FOREIGN KEY (id_treinamento) REFERENCES treinamento (id_treinamento) ON DELETE CASCADE
);

CREATE TABLE quiz_pergunta (
    id_pergunta    INT AUTO_INCREMENT PRIMARY KEY,
    id_treinamento INT NOT NULL,
    enunciado      TEXT NOT NULL,
    explicacao     TEXT NOT NULL,
    CONSTRAINT fk_pergunta_quiz FOREIGN KEY (id_treinamento) REFERENCES treinamento_quiz (id_treinamento) ON DELETE CASCADE
);

CREATE TABLE quiz_opcao (
    id_opcao       INT AUTO_INCREMENT PRIMARY KEY,
    id_pergunta    INT NOT NULL,
    texto          TEXT NOT NULL,
    is_correta     BOOLEAN NOT NULL,
    CONSTRAINT fk_opcao_pergunta FOREIGN KEY (id_pergunta) REFERENCES quiz_pergunta (id_pergunta) ON DELETE CASCADE
);

-- Remove dados mocks para não quebrar a Foreign Key
DELETE FROM pontuacao_evento WHERE tipo_evento = 'TREINAMENTO';
DELETE FROM treinamento_concluido;

ALTER TABLE treinamento_concluido
DROP COLUMN codigo_curso,
ADD COLUMN id_treinamento INT NOT NULL;

ALTER TABLE treinamento_concluido
ADD CONSTRAINT fk_concluido_treinamento FOREIGN KEY (id_treinamento) REFERENCES treinamento (id_treinamento) ON DELETE CASCADE;

-- INSERTS (Videos)
INSERT INTO treinamento (id_treinamento, tipo, titulo, descricao, categoria, pontos) VALUES
(1, 'VIDEO', 'O que é Phishing? Como se proteger', 'Entenda como funcionam os ataques de phishing e quais são as principais táticas usadas pelos criminosos para enganar vítimas.', 'Phishing', 50),
(2, 'VIDEO', 'Engenharia Social: A arte de enganar', 'Descubra como atacantes exploram a psicologia humana para obter informações confidenciais sem precisar hackear sistemas.', 'Phishing', 50),
(3, 'VIDEO', 'Como criar senhas seguras e gerenciá-las', 'Aprenda as melhores práticas para criar senhas fortes, únicas e como usar gerenciadores de senhas no dia a dia.', 'Senhas', 50),
(4, 'VIDEO', 'Autenticação de dois fatores (2FA) explicada', 'Entenda o que é 2FA, por que é importante e como ativar nos principais serviços que você usa.', 'Senhas', 50),
(5, 'VIDEO', 'Privacidade nas redes sociais', 'Saiba quais informações você expõe sem perceber nas redes sociais e como configurar sua privacidade adequadamente.', 'Redes Sociais', 50),
(6, 'VIDEO', 'Segurança no e-mail corporativo', 'Boas práticas para o uso seguro do e-mail no ambiente de trabalho, identificando ameaças e protegendo dados da empresa.', 'Corporativo', 50),
(7, 'VIDEO', 'Como identificar sites falsos', 'Técnicas práticas para verificar se um site é legítimo ou uma cópia fraudulenta antes de inserir qualquer dado.', 'Phishing', 50),
(8, 'VIDEO', 'Trabalho remoto seguro: proteja sua empresa', 'Orientações essenciais para manter a segurança da informação enquanto trabalha de casa ou em locais públicos.', 'Corporativo', 50);

INSERT INTO treinamento_video (id_treinamento, youtube_id, duracao_minutos) VALUES
(1, 'XBkzBrXlle0', 8),
(2, 'lc7scxvKQOo', 12),
(3, 'aEmXQXFBFAk', 6),
(4, 'ZXFYT-BG2So', 5),
(5, 'ArEQjCiHgEk', 9),
(6, 'Y7zNlEMDmI4', 11),
(7, 'jW_GFpYMdO4', 7),
(8, 'snRocIB5LH4', 14);

-- INSERTS (Quizzes)
INSERT INTO treinamento (id_treinamento, tipo, titulo, descricao, categoria, pontos) VALUES
(9, 'QUIZ', 'Identificando E-mails Falsos', 'Aprenda a reconhecer sinais de phishing em e-mails do dia a dia.', 'Phishing', 50),
(10, 'QUIZ', 'Phishing por SMS e WhatsApp', 'Saiba como ataques de smishing funcionam em dispositivos móveis.', 'Mobile', 50);

INSERT INTO treinamento_quiz (id_treinamento, nivel, cor_tema) VALUES
(9, 'Iniciante', 'bg-teal-700'),
(10, 'Intermediário', 'bg-indigo-700');

-- INSERTS (Quiz 1 Questions & Options)
INSERT INTO quiz_pergunta (id_pergunta, id_treinamento, enunciado, explicacao) VALUES
(1, 9, 'Você recebe um e-mail do ''banco@seguro-atualizacao.com'' pedindo para confirmar seus dados bancários com urgência. O que você faz?', 'Sempre contate o banco pelo número oficial do site ou cartão. Domínios suspeitos como ''seguro-atualizacao.com'' são sinais claros de phishing.'),
(2, 9, 'Qual destes elementos É um sinal de phishing em um e-mail?', 'Links que mostram destinos diferentes do texto exibido são um dos maiores indicadores de phishing. Sempre passe o mouse sobre links antes de clicar.'),
(3, 9, 'Você recebe um e-mail da ''TI'' pedindo sua senha para ''manutenção do sistema''. O que isso indica?', 'Nenhuma equipe de TI legítima pede senhas por e-mail. Esse é um dos métodos mais comuns de engenharia social.'),
(4, 9, 'Qual prática é CORRETA ao receber um e-mail suspeito no trabalho?', 'Reportar e-mails suspeitos é fundamental! Mesmo que seja um falso positivo, a equipe de segurança prefere analisar do que perder uma ameaça real.'),
(5, 9, 'Um e-mail diz: ''URGENTE: Sua conta será bloqueada em 24h. Clique aqui.'' Isso é um exemplo de:', 'Criar senso de urgência é uma das táticas mais comuns de phishing. Atacantes querem que você aja antes de pensar com calma.');

INSERT INTO quiz_opcao (id_pergunta, texto, is_correta) VALUES
(1, 'Clica no link e preenche os dados rapidamente', FALSE),
(1, 'Ignora e exclui o e-mail', FALSE),
(1, 'Liga para o banco usando o número oficial no site deles', TRUE),
(1, 'Responde o e-mail pedindo mais informações', FALSE),
(2, 'O remetente usa o domínio oficial da empresa (@empresa.com.br)', FALSE),
(2, 'O e-mail tem seu nome completo correto na saudação', FALSE),
(2, 'O link ao passar o mouse mostra um domínio diferente do exibido', TRUE),
(2, 'O e-mail foi enviado em horário comercial', FALSE),
(3, 'É uma solicitação legítima de TI', FALSE),
(3, 'É definitivamente phishing — equipes de TI nunca pedem senhas', TRUE),
(3, 'Depende se você conhece o remetente', FALSE),
(3, 'Apenas se o e-mail tiver erros de português', FALSE),
(4, 'Encaminhar para colegas para ver o que eles acham', FALSE),
(4, 'Clicar nos links para confirmar se são perigosos', FALSE),
(4, 'Reportar para o time de segurança da empresa', TRUE),
(4, 'Deletar sem reportar para não criar problemas', FALSE),
(5, 'Comunicação legítima de serviço ao cliente', FALSE),
(5, 'Tática de urgência usada em phishing para forçar ação impulsiva', TRUE),
(5, 'Notificação de segurança padrão', FALSE),
(5, 'Um bug no sistema de e-mails', FALSE);

-- INSERTS (Quiz 2 Questions & Options)
INSERT INTO quiz_pergunta (id_pergunta, id_treinamento, enunciado, explicacao) VALUES
(6, 10, 'Você recebe um SMS: ''Seu pacote não pôde ser entregue. Pague R$3,99 de taxa: [link curto]''. O que fazer?', 'Nunca acesse links em SMS não solicitados. Acesse o site oficial da transportadora digitando o endereço manualmente no navegador.'),
(7, 10, 'Um amigo te envia um link no WhatsApp dizendo ''Olha esse sorteio incrível''. O que é recomendado?', 'Contas de WhatsApp podem ser comprometidas. Confirme pelo telefone se seu amigo realmente enviou aquela mensagem antes de clicar em qualquer link.');

INSERT INTO quiz_opcao (id_pergunta, texto, is_correta) VALUES
(6, 'Pagar a taxa pequena — não vale o risco de perder o pacote', FALSE),
(6, 'Clicar no link para ver mais detalhes', FALSE),
(6, 'Contatar a transportadora pelo site/app oficial para verificar', TRUE),
(6, 'Responder o SMS pedindo mais informações', FALSE),
(7, 'Abrir porque veio de um amigo confiável', FALSE),
(7, 'Verificar com o amigo por ligação se ele realmente enviou antes de abrir', TRUE),
(7, 'Compartilhar com outros amigos para mais pessoas participarem', FALSE),
(7, 'Abrir em modo de navegação anônima — é mais seguro', FALSE);
