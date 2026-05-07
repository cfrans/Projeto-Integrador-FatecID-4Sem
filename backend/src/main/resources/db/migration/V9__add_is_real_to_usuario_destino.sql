-- Migration V9: Adiciona campo para distinguir usuários reais de usuários mock
-- Finalidade: Permitir o volume de dados para apresentação sem realizar disparos reais para e-mails fictícios.

ALTER TABLE usuario_destino ADD COLUMN is_real BOOLEAN DEFAULT FALSE;

-- Comentário para documentar que esta alteração é voltada para a estratégia de apresentação
-- e simulação offline do sistema.
