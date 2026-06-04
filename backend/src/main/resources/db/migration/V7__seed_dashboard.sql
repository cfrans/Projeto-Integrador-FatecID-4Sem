-- Seed de demonstracao: campanhas, disparos, eventos de pontuacao e treinamentos.
-- Comportamento deterministico (formulas com MOD) gera mix realista por setor para popular o dashboard.

-- 1) Campanhas (8 campanhas espalhadas entre Nov/2025 e Mai/2026)
INSERT INTO campanha (nome_campanha, assunto_email, nome_anexo, status_envio, data_criacao, id_modelo, id_usuario_sistema) VALUES
('Q4 - Senha Expirada',           'Sua senha expira em 24h - acao necessaria', 'senha_atualizar.html', 'Enviado', '2025-12-15 09:30:00', 1, 1),
('Black Friday - Alerta Bancario','Alerta de Seguranca - Atividade suspeita',  'extrato.pdf',          'Enviado', '2026-01-10 14:00:00', 2, 1),
('Inicio de Ano - RH Cadastro',   'Atualizacao cadastral obrigatoria',         'formulario_rh.pdf',    'Enviado', '2026-02-08 10:15:00', 3, 1),
('Carnaval - Senha TI',           'Renovacao de credenciais obrigatoria',      'renovar.html',         'Enviado', '2026-03-12 08:45:00', 1, 1),
('Marco - Bancario Bradesco',     'Comprovante de transacao - verificar',      'comprovante.pdf',      'Enviado', '2026-04-04 11:20:00', 2, 1),
('RH - Holerite atualizado',      'Holerite disponivel para download',         'holerite.pdf',         'Enviado', '2026-04-22 13:50:00', 3, 1),
('Q2 - Reset de Senha',           'Reset obrigatorio - prazo final',           'reset.html',           'Enviado', '2026-05-15 09:00:00', 1, 1),
('Maio - Alerta Bancario',        'Notificacao de saldo - acesso urgente',     'seguranca.pdf',        'Enviado', '2026-06-10 16:30:00', 2, 1);

-- 2) Cada campanha atinge todos os 6 setores
INSERT INTO setor_campanha (id_campanha, id_setor)
SELECT c.id_campanha, s.id_setor
FROM campanha c CROSS JOIN setor s;

-- 3) Disparos (50 usuarios x 8 campanhas = 400)
--    Taxas por setor:
--    - 1 Financeiro: 30% clique, 25% reporte
--    - 2 TI:          15% clique, 40% reporte
--    - 3 RH:          35% clique, 20% reporte
--    - 4 Comercial:   55% clique, 10% reporte
--    - 5 Marketing:   50% clique, 10% reporte
--    - 6 Diretoria:   20% clique, 35% reporte
--    Anexo: ~55% dos clickers. Reporte e mutuamente exclusivo com clique.
INSERT INTO disparos (id_usuario_destino, id_campanha, token_unico, clicou_link, abriu_anexo, reportou_phishing, data_envio)
WITH base AS (
    SELECT
        u.id_usuario_destino,
        u.matricula,
        u.id_setor,
        c.id_campanha,
        c.data_criacao,
        ((u.matricula + c.id_campanha * 7)  % 100) AS r_clique,
        ((u.matricula + c.id_campanha * 13) % 100) AS r_anexo,
        ((u.matricula + c.id_campanha * 11) % 100) AS r_reporte,
        CASE u.id_setor WHEN 1 THEN 30 WHEN 2 THEN 15 WHEN 3 THEN 35
                        WHEN 4 THEN 55 WHEN 5 THEN 50 WHEN 6 THEN 20 END AS taxa_clique,
        CASE u.id_setor WHEN 1 THEN 25 WHEN 2 THEN 40 WHEN 3 THEN 20
                        WHEN 4 THEN 10 WHEN 5 THEN 10 WHEN 6 THEN 35 END AS taxa_reporte
    FROM usuario_destino u
    CROSS JOIN campanha c
)
SELECT
    id_usuario_destino,
    id_campanha,
    CONCAT('tok-c', id_campanha, '-u', matricula),
    (r_clique < taxa_clique),
    (r_clique < taxa_clique AND r_anexo < 55),
    (r_clique >= taxa_clique AND r_reporte < taxa_reporte),
    DATE_ADD(data_criacao, INTERVAL ((matricula % 12) + 1) HOUR)
FROM base;

-- 4) Eventos de pontuacao (saldo_apos sera calculado ao final via window function)
INSERT INTO pontuacao_evento (id_usuario_destino, id_disparo, id_campanha, tipo_evento, delta, saldo_apos, criado_em)
SELECT id_usuario_destino, id_disparo, id_campanha, 'CLIQUE_LINK', -20, 0,
       DATE_ADD(data_envio, INTERVAL 5 MINUTE)
FROM disparos WHERE clicou_link = TRUE;

INSERT INTO pontuacao_evento (id_usuario_destino, id_disparo, id_campanha, tipo_evento, delta, saldo_apos, criado_em)
SELECT id_usuario_destino, id_disparo, id_campanha, 'ABRIU_ANEXO', -30, 0,
       DATE_ADD(data_envio, INTERVAL 7 MINUTE)
FROM disparos WHERE abriu_anexo = TRUE;

INSERT INTO pontuacao_evento (id_usuario_destino, id_disparo, id_campanha, tipo_evento, delta, saldo_apos, criado_em)
SELECT id_usuario_destino, id_disparo, id_campanha, 'REPORTE_PHISHING', 30, 0,
       DATE_ADD(data_envio, INTERVAL 3 MINUTE)
FROM disparos WHERE reportou_phishing = TRUE;

-- 5) Treinamentos concluidos (usuarios que mais clicaram tendem a fazer treinamento)
INSERT INTO treinamento_concluido (id_usuario_destino, codigo_curso, data_conclusao)
SELECT id_usuario_destino, 'PHISH-101', '2026-03-20 14:00:00'
FROM usuario_destino
WHERE matricula IN (8839, 1386, 3134, 9621, 4601, 3148, 1864, 3375, 5128, 4554, 7499, 1507);

INSERT INTO treinamento_concluido (id_usuario_destino, codigo_curso, data_conclusao)
SELECT id_usuario_destino, 'PHISH-201', '2026-05-08 10:30:00'
FROM usuario_destino
WHERE matricula IN (8839, 3134, 9621, 1864, 7499);

INSERT INTO pontuacao_evento (id_usuario_destino, id_disparo, id_campanha, tipo_evento, delta, saldo_apos, referencia_externa, criado_em)
SELECT id_usuario_destino, NULL, NULL, 'TREINAMENTO', 50, 0, 'PHISH-101', '2026-03-20 14:00:00'
FROM usuario_destino
WHERE matricula IN (8839, 1386, 3134, 9621, 4601, 3148, 1864, 3375, 5128, 4554, 7499, 1507);

INSERT INTO pontuacao_evento (id_usuario_destino, id_disparo, id_campanha, tipo_evento, delta, saldo_apos, referencia_externa, criado_em)
SELECT id_usuario_destino, NULL, NULL, 'TREINAMENTO', 50, 0, 'PHISH-201', '2026-05-08 10:30:00'
FROM usuario_destino
WHERE matricula IN (8839, 3134, 9621, 1864, 7499);

-- 6) Recalcular saldo_apos cronologicamente por usuario
UPDATE pontuacao_evento pe
JOIN (
    SELECT id_pontuacao_evento,
           500 + SUM(delta) OVER (PARTITION BY id_usuario_destino ORDER BY criado_em, id_pontuacao_evento) AS saldo
    FROM pontuacao_evento
) calc ON pe.id_pontuacao_evento = calc.id_pontuacao_evento
SET pe.saldo_apos = calc.saldo;

-- 7) Atualizar pontuacao final dos usuarios para refletir os eventos
UPDATE usuario_destino u
JOIN (
    SELECT id_usuario_destino, COALESCE(SUM(delta), 0) AS total
    FROM pontuacao_evento
    GROUP BY id_usuario_destino
) e ON u.id_usuario_destino = e.id_usuario_destino
SET u.pontuacao = 500 + e.total;

-- 8) Ultimo login variado
UPDATE usuario_destino SET ultimo_login = DATE_SUB('2026-06-11 09:00:00', INTERVAL (matricula % 30) DAY);
UPDATE usuario_sistema SET ultimo_login = '2026-06-11 18:23:00' WHERE email = 'admin@nemo.com';
