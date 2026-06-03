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
(1, 'VIDEO', 'O que é Phishing?', 'Entenda como funcionam os ataques de phishing e quais são as principais táticas usadas pelos criminosos para enganar vítimas.', 'Phishing', 50),
(2, 'VIDEO', 'O que é Engenharia Social?', 'Descubra como os cibercriminosos manipulam as pessoas para obter informações confidenciais ou acesso a sistemas.', 'Phishing', 50),
(3, 'VIDEO', 'Criando senhas seguras', 'Aprenda as melhores práticas para criar senhas fortes e únicas para proteger suas contas online contra invasões.', 'Senhas', 50),
(4, 'VIDEO', 'O que é 2FA e como funciona?', 'Entenda a importância da Autenticação de Dois Fatores (2FA) e como ativá-la para adicionar uma camada extra de segurança.', 'Senhas', 50),
(5, 'VIDEO', 'Sete conselhos para prevenir riscos nas redes sociais', 'Saiba como proteger suas informações pessoais e evitar armadilhas comuns ao usar as redes sociais no dia a dia.', 'Redes Sociais', 50),
(6, 'VIDEO', 'Segurança no Trabalho Remoto', 'Conheça as melhores práticas e cuidados essenciais para manter a segurança da informação enquanto trabalha de casa.', 'Corporativo', 50),
(7, 'VIDEO', 'Como identificar sites falsos', 'Aprenda a verificar a legitimidade de sites e evitar cair em golpes ao inserir dados pessoais ou bancários na internet.', 'Phishing', 50);

INSERT INTO treinamento_video (id_treinamento, youtube_id, duracao_minutos) VALUES
(1, 'qnlnvGGZWR4', 8),
(2, 'R9RcENv-jo4', 12),
(3, '1BchHRVXcQA', 6),
(4, 'TnOazYC81R8', 5),
(5, 'QFdkggG34wo', 9),
(6, '_Mu4MsUo_8Q', 11),
(7, 'NKsquXoXBvQ', 7);

-- INSERTS (Quizzes)
INSERT INTO treinamento (id_treinamento, tipo, titulo, descricao, categoria, pontos) VALUES
(9, 'QUIZ', 'Identificando E-mails Falsos', 'Aprenda a reconhecer sinais de phishing em e-mails do dia a dia.', 'Phishing', 50),
(10, 'QUIZ', 'Phishing por SMS e WhatsApp', 'Saiba como ataques de smishing funcionam em dispositivos móveis.', 'Mobile', 50),
(11, 'QUIZ', 'Phishing Avançado: Spear Phishing e Clones', 'Reconheça ataques direcionados, sites clonados e anexos maliciosos.', 'Phishing', 50),
(12, 'QUIZ', 'Senhas Fortes e Autenticação em 2 Fatores', 'Crie senhas seguras, use gerenciadores e entenda o poder do 2FA.', 'Senhas', 50),
(13, 'QUIZ', 'Engenharia Social: O Ataque Humano', 'Descubra como criminosos manipulam pessoas para obter acessos.', 'Phishing', 50),
(14, 'QUIZ', 'Segurança no Trabalho e Dados Corporativos', 'Boas práticas para proteger dados e sistemas no dia a dia da empresa.', 'Corporativo', 50);

INSERT INTO treinamento_quiz (id_treinamento, nivel, cor_tema) VALUES
(9, 'Iniciante', 'bg-teal-700'),
(10, 'Intermediário', 'bg-indigo-700'),
(11, 'Avançado', 'bg-rose-700'),
(12, 'Iniciante', 'bg-teal-700'),
(13, 'Intermediário', 'bg-cyan-700'),
(14, 'Intermediário', 'bg-indigo-700');

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

-- INSERTS (Quiz 2 — perguntas adicionais para completar 5 questões)
INSERT INTO quiz_pergunta (id_pergunta, id_treinamento, enunciado, explicacao) VALUES
(8, 10, 'Você recebe um SMS do seu ''banco'' com um link para regularizar uma pendência. O número é desconhecido. Qual a atitude correta?', 'Bancos não enviam links por SMS para regularizar pendências. Acesse o app oficial ou ligue para a central pelo número do verso do cartão.'),
(9, 10, 'No WhatsApp, alguém se passa pelo seu chefe pedindo que você compre cartões-presente com urgência e envie os códigos. O que fazer?', 'Pedidos urgentes de cartões-presente ou transferências por mensagem são um golpe clássico (fraude do CEO). Confirme por um canal já conhecido antes de qualquer ação.'),
(10, 10, 'Como confirmar se um link curto (ex: bit.ly) recebido por mensagem é seguro antes de abrir?', 'Links curtos escondem o destino real. Na dúvida, não clique: acesse o serviço oficial digitando o endereço manualmente no navegador.');

INSERT INTO quiz_opcao (id_pergunta, texto, is_correta) VALUES
(8, 'Clicar no link, pois pode ser uma pendência real', FALSE),
(8, 'Responder o SMS perguntando do que se trata', FALSE),
(8, 'Abrir o app oficial do banco ou ligar para a central oficial para verificar', TRUE),
(8, 'Encaminhar o SMS para o suporte do banco pelo WhatsApp', FALSE),
(9, 'Comprar os cartões para não contrariar o chefe', FALSE),
(9, 'Confirmar pessoalmente ou ligando para o número que você já conhece do chefe', TRUE),
(9, 'Enviar os códigos, pois o contato tem a foto do seu chefe', FALSE),
(9, 'Pedir um adiantamento ao financeiro para comprar os cartões', FALSE),
(10, 'Abrir direto, pois links curtos são sempre de empresas confiáveis', FALSE),
(10, 'Abrir em uma aba anônima, que protege contra qualquer site', FALSE),
(10, 'Clicar e fechar rápido caso pareça suspeito', FALSE),
(10, 'Não clicar e acessar o serviço oficial digitando o endereço no navegador', TRUE);

-- ============================================================================
-- INSERTS (Quiz 3 — Phishing Avançado: Spear Phishing e Clones | id 11)
-- ============================================================================
INSERT INTO quiz_pergunta (id_pergunta, id_treinamento, enunciado, explicacao) VALUES
(11, 11, 'O que caracteriza um ataque de spear phishing em comparação ao phishing comum?', 'Spear phishing é direcionado: o atacante pesquisa a vítima (nome, cargo, projetos) para criar uma mensagem personalizada e muito mais convincente.'),
(12, 11, 'Um site de login idêntico ao do seu banco aparece no domínio ''banco-seguro-atualiza.com''. Isso é um exemplo de:', 'Clonagem de site: a página copia o visual do site real para roubar suas credenciais. Sempre confira o domínio exato e o HTTPS antes de digitar dados.'),
(13, 11, 'Por que um e-mail de spear phishing pode parecer tão convincente?', 'Atacantes usam dados reais (nomes, logos, assuntos internos) obtidos em redes sociais e vazamentos. Aparência profissional não garante legitimidade.'),
(14, 11, 'Qual a melhor forma de verificar um pedido financeiro inesperado recebido por e-mail, mesmo que pareça vir do seu gestor?', 'Confirme por um canal independente já conhecido (ligação ou pessoalmente). Nunca responda só ao e-mail, pois a conta pode estar comprometida ou o remetente falsificado.'),
(15, 11, 'Um anexo chamado ''Fatura_Outubro.pdf.exe'' chega por e-mail. O que esse nome indica?', 'A dupla extensão ''.pdf.exe'' revela um executável disfarçado de PDF — provável malware. Nunca abra; reporte ao time de segurança.');

INSERT INTO quiz_opcao (id_pergunta, texto, is_correta) VALUES
(11, 'É enviado em massa para milhares de pessoas aleatórias', FALSE),
(11, 'Só acontece por SMS', FALSE),
(11, 'É um ataque personalizado e direcionado a uma pessoa ou empresa específica', TRUE),
(11, 'É um phishing que nunca usa links', FALSE),
(12, 'Um site clonado, criado para roubar suas credenciais', TRUE),
(12, 'Um site oficial alternativo do banco', FALSE),
(12, 'Uma versão de testes do banco', FALSE),
(12, 'Um espelho seguro para acesso mais rápido', FALSE),
(13, 'Porque sempre tem erros de português óbvios', FALSE),
(13, 'Porque é enviado fora do horário comercial', FALSE),
(13, 'Porque nunca contém links ou anexos', FALSE),
(13, 'Porque usa dados reais da vítima e da empresa para parecer autêntico', TRUE),
(14, 'Responder o próprio e-mail pedindo confirmação', FALSE),
(14, 'Confirmar por um canal independente, como ligação ou pessoalmente', TRUE),
(14, 'Aprovar, pois o e-mail tem a assinatura do gestor', FALSE),
(14, 'Encaminhar para um colega decidir', FALSE),
(15, 'É um PDF normal de fatura', FALSE),
(15, 'É um arquivo compactado e seguro', FALSE),
(15, 'É um executável disfarçado de PDF, provavelmente malware', TRUE),
(15, 'É apenas um erro de nome, pode abrir sem problema', FALSE);

-- ============================================================================
-- INSERTS (Quiz 4 — Senhas Fortes e Autenticação em 2 Fatores | id 12)
-- ============================================================================
INSERT INTO quiz_pergunta (id_pergunta, id_treinamento, enunciado, explicacao) VALUES
(16, 12, 'Qual destas é a senha mais segura?', 'Senhas longas, com mistura de letras, números e símbolos, e sem relação com dados pessoais, são as mais difíceis de quebrar.'),
(17, 12, 'Por que não se deve reutilizar a mesma senha em vários sites?', 'Se um site sofre vazamento, criminosos testam a mesma senha em outros serviços (credential stuffing). Senhas únicas limitam o estrago a um só lugar.'),
(18, 12, 'Para que serve um gerenciador de senhas?', 'Ele cria e guarda senhas fortes e únicas para cada serviço, protegidas por uma senha-mestra. Você só precisa lembrar de uma senha forte.'),
(19, 12, 'O que é a autenticação de dois fatores (2FA)?', 'É uma camada extra: além da senha (algo que você sabe), exige um segundo fator, como um código no celular (algo que você tem). Mesmo com a senha roubada, o invasor não entra.'),
(20, 12, 'Você recebe uma ligação pedindo o código 2FA que acabou de chegar no seu celular. O que fazer?', 'Nunca compartilhe seu código 2FA com ninguém — nem com supostos atendentes. O código é só para você digitar. Quem pede é golpista.');

INSERT INTO quiz_opcao (id_pergunta, texto, is_correta) VALUES
(16, '123456', FALSE),
(16, 'seunome2024', FALSE),
(16, 'senha', FALSE),
(16, 'Lua$Verde7!Caminhao_92', TRUE),
(17, 'Porque dá trabalho digitar senhas diferentes', FALSE),
(17, 'Porque se um site vazar, suas outras contas ficam expostas', TRUE),
(17, 'Porque os sites proíbem senhas repetidas', FALSE),
(17, 'Não tem problema reutilizar, desde que a senha seja forte', FALSE),
(18, 'Criar e guardar senhas fortes e únicas com segurança', TRUE),
(18, 'Deixar todas as senhas iguais e fáceis de lembrar', FALSE),
(18, 'Compartilhar senhas com colegas de equipe', FALSE),
(18, 'Anotar senhas em um arquivo de texto sem proteção', FALSE),
(19, 'Usar duas senhas diferentes no mesmo login', FALSE),
(19, 'Trocar a senha duas vezes por mês', FALSE),
(19, 'Uma segunda verificação além da senha, como um código no celular', TRUE),
(19, 'Ter dois usuários compartilhando a mesma conta', FALSE),
(20, 'Informar o código, pois a empresa solicitou', FALSE),
(20, 'Nunca compartilhar o código; empresas legítimas não pedem isso', TRUE),
(20, 'Ler apenas os primeiros dígitos do código', FALSE),
(20, 'Anotar e enviar o código por e-mail', FALSE);

-- ============================================================================
-- INSERTS (Quiz 5 — Engenharia Social: O Ataque Humano | id 13)
-- ============================================================================
INSERT INTO quiz_pergunta (id_pergunta, id_treinamento, enunciado, explicacao) VALUES
(21, 13, 'O que é engenharia social no contexto de segurança da informação?', 'É a manipulação psicológica das pessoas para obter informações ou acessos, explorando confiança, medo ou urgência — sem precisar invadir sistemas tecnicamente.'),
(22, 13, 'Uma pessoa liga dizendo ser do suporte de TI e pede sua senha para resolver um problema. Isso é um exemplo de:', 'Vishing (phishing por voz). O suporte legítimo nunca pede sua senha. Desligue e confirme pelo ramal oficial da TI.'),
(23, 13, 'O que é tailgating (carona) em segurança física?', 'É quando alguém sem crachá entra em uma área restrita aproveitando que você segurou a porta. Por educação abrimos espaço — e é isso que o atacante explora.'),
(24, 13, 'Um pendrive ''perdido'' aparece no estacionamento da empresa. Qual o risco de conectá-lo ao seu computador?', 'Pendrives desconhecidos podem conter malware que infecta a máquina ao serem conectados (baiting). Nunca conecte; entregue ao time de segurança.'),
(25, 13, 'Qual tática emocional os engenheiros sociais mais exploram para induzir ações rápidas?', 'Senso de urgência e autoridade (''é o diretor'', ''resolva agora'') desligam o pensamento crítico. Desconfie de pressa e pressão; pare e verifique.');

INSERT INTO quiz_opcao (id_pergunta, texto, is_correta) VALUES
(21, 'Um método de programação de sistemas', FALSE),
(21, 'A manipulação de pessoas para obter informações ou acessos', TRUE),
(21, 'Uma rede social corporativa', FALSE),
(21, 'Um tipo de firewall', FALSE),
(22, 'Um atendimento normal de TI', FALSE),
(22, 'Uma pesquisa de satisfação', FALSE),
(22, 'Um teste de qualidade da ligação', FALSE),
(22, 'Vishing — engenharia social por telefone; nunca informe a senha', TRUE),
(23, 'Seguir alguém autorizado para entrar em área restrita sem credencial', TRUE),
(23, 'Estacionar muito próximo da empresa', FALSE),
(23, 'Usar dois crachás ao mesmo tempo', FALSE),
(23, 'Um software de monitoramento de rede', FALSE),
(24, 'Nenhum, pendrives são sempre inofensivos', FALSE),
(24, 'Só há risco se você abrir todos os arquivos', FALSE),
(24, 'Pode conter malware e infectar o computador ao ser conectado', TRUE),
(24, 'O risco é apenas perder espaço em disco', FALSE),
(25, 'Tédio', FALSE),
(25, 'Urgência e autoridade, para impedir o pensamento crítico', TRUE),
(25, 'Curiosidade sobre o clima', FALSE),
(25, 'Gratidão por brindes', FALSE);

-- ============================================================================
-- INSERTS (Quiz 6 — Segurança no Trabalho e Dados Corporativos | id 14)
-- ============================================================================
INSERT INTO quiz_pergunta (id_pergunta, id_treinamento, enunciado, explicacao) VALUES
(26, 14, 'Você precisa enviar uma planilha com dados de clientes. Qual é a prática mais segura?', 'Use os canais e ferramentas aprovados pela empresa, com acesso restrito a quem precisa. Evite e-mails pessoais e serviços não autorizados para dados sensíveis.'),
(27, 14, 'Ao trabalhar de um café com Wi-Fi público, qual cuidado é essencial?', 'Redes públicas podem ser monitoradas. Use a VPN da empresa para criptografar a conexão e evite acessar sistemas sensíveis sem proteção.'),
(28, 14, 'Ao se afastar da sua mesa, mesmo por pouco tempo, você deve:', 'Bloquear a tela (Windows: tecla Win+L) evita que alguém acesse seus sistemas e dados enquanto você está ausente. É simples e muito eficaz.'),
(29, 14, 'Você percebe que clicou em um link suspeito em um e-mail de trabalho. Qual a melhor atitude?', 'Reportar imediatamente ao time de segurança/TI permite conter o incidente rápido. Esconder o erro só dá tempo ao atacante. Errar acontece; omitir agrava.'),
(30, 14, 'Por que documentos sensíveis não devem ficar visíveis na mesa ou na impressora?', 'A política de mesa limpa evita que informações confidenciais sejam vistas ou levadas por pessoas não autorizadas. Guarde e recolha impressões imediatamente.');

INSERT INTO quiz_opcao (id_pergunta, texto, is_correta) VALUES
(26, 'Enviar para o seu e-mail pessoal para acessar de casa', FALSE),
(26, 'Postar em um grupo de WhatsApp da equipe', FALSE),
(26, 'Usar a ferramenta corporativa aprovada, restringindo o acesso a quem precisa', TRUE),
(26, 'Subir em um drive pessoal público', FALSE),
(27, 'Conectar normalmente, pois redes públicas são seguras', FALSE),
(27, 'Usar a VPN da empresa para proteger a conexão', TRUE),
(27, 'Desligar o antivírus para a rede funcionar melhor', FALSE),
(27, 'Compartilhar a senha do sistema com o estabelecimento', FALSE),
(28, 'Deixar tudo aberto para agilizar quando voltar', FALSE),
(28, 'Desligar apenas o monitor', FALSE),
(28, 'Pedir para um colega vigiar o computador', FALSE),
(28, 'Bloquear a tela do computador', TRUE),
(29, 'Reportar imediatamente ao time de segurança/TI', TRUE),
(29, 'Não contar a ninguém para evitar problemas', FALSE),
(29, 'Apenas reiniciar o computador e seguir trabalhando', FALSE),
(29, 'Esperar para ver se algo de ruim acontece', FALSE),
(30, 'Apenas por uma questão de organização visual', FALSE),
(30, 'Porque ocupa espaço na impressora', FALSE),
(30, 'Para evitar que pessoas não autorizadas vejam ou levem dados confidenciais', TRUE),
(30, 'Não há problema, o escritório é totalmente seguro', FALSE);
