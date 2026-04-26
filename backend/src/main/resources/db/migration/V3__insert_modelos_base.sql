INSERT INTO modelo (nome_modelo, dominio_alvo, remetente_falso, assunto_padrao, texto_html, id_usuario_sistema) VALUES
(
  'Alerta de Senha Expirada',
  'ti.acesso-seguro.top',
  'Suporte TI <ti@ti.acesso-seguro.top>',
  'Sua senha expira em 24h — ação necessária',
  '<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:8px;background:#fff"><div style="background:#0f172a;padding:16px 24px;border-radius:6px 6px 0 0;margin:-24px -24px 24px"><p style="color:#fff;font-size:13px;margin:0">🔒 Equipe de Tecnologia da Informação</p></div><h2 style="color:#b45309;font-size:18px">⚠️ Sua senha de rede expira em menos de 24 horas</h2><p style="color:#475569;font-size:14px;line-height:1.6">Identificamos que sua senha corporativa está prestes a vencer. Para evitar o bloqueio do seu acesso aos sistemas internos, clique no botão abaixo e realize a atualização imediatamente.</p><a href="{{LINK_AQUI}}" style="display:inline-block;background:#ea580c;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;margin:16px 0">Atualizar Senha Agora</a><p style="color:#94a3b8;font-size:12px;margin-top:24px;border-top:1px solid #f1f5f9;padding-top:12px">Se você já atualizou sua senha, ignore este e-mail. Em caso de dúvidas, contate o suporte.</p></div>',
  1
),
(
  'Falso Alerta de Segurança Bancária',
  'bradesco.acesso-seguro.top',
  'Segurança Bradesco <seguranca@bradesco.acesso-seguro.top>',
  'Alerta de Segurança — Atividade suspeita detectada',
  '<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:0;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;background:#fff"><div style="background:#cc0000;padding:20px 24px;display:flex;align-items:center;gap:12px"><p style="color:#fff;font-size:16px;font-weight:700;margin:0">🏦 Banco Bradesco S.A.</p></div><div style="padding:24px"><h2 style="color:#1e293b;font-size:17px;margin-top:0">Atividade suspeita identificada na sua conta</h2><p style="color:#475569;font-size:14px;line-height:1.6">Detectamos uma tentativa de acesso à sua conta corrente em um dispositivo não reconhecido. Por precaução, limitamos temporariamente algumas funcionalidades.</p><div style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px 16px;margin:16px 0;border-radius:4px"><p style="color:#7f1d1d;font-size:13px;margin:0">📍 Local: São Paulo, SP — 03h14 — Dispositivo desconhecido</p></div><p style="color:#475569;font-size:14px">Para desbloquear sua conta e confirmar sua identidade, acesse o link seguro abaixo:</p><a href="{{LINK_AQUI}}" style="display:inline-block;background:#cc0000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;margin:8px 0">Confirmar Minha Identidade</a><p style="color:#94a3b8;font-size:12px;margin-top:24px;border-top:1px solid #f1f5f9;padding-top:12px">Bradesco nunca solicita sua senha por telefone ou e-mail.</p></div></div>',
  1
),
(
  'Recadastramento Obrigatório RH',
  'rh.acesso-seguro.top',
  'Recursos Humanos <rh@rh.acesso-seguro.top>',
  'Atualização cadastral obrigatória — prazo até sexta-feira',
  '<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:8px;background:#fff"><div style="background:#0f172a;padding:16px 24px;margin:-24px -24px 24px;border-radius:6px 6px 0 0"><p style="color:#fff;font-size:13px;margin:0">👥 Departamento de Recursos Humanos</p></div><h2 style="color:#1e293b;font-size:17px">Atualização Cadastral — Ação Obrigatória</h2><p style="color:#475569;font-size:14px;line-height:1.6">Prezado(a) colaborador(a),</p><p style="color:#475569;font-size:14px;line-height:1.6">O setor de RH informa que todos os colaboradores devem atualizar seus dados cadastrais até esta <strong>sexta-feira</strong> para garantir a correta emissão do holerite e benefícios do próximo mês.</p><p style="color:#475569;font-size:14px">Acesse o Portal do Colaborador pelo link abaixo:</p><a href="{{LINK_AQUI}}" style="display:inline-block;background:#0f766e;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;margin:8px 0">Acessar Portal do Colaborador</a><p style="color:#94a3b8;font-size:12px;margin-top:24px;border-top:1px solid #f1f5f9;padding-top:12px">Em caso de dúvidas, entre em contato com o RH pelo ramal 1234.</p></div>',
  1
);