package com.nemo.api.email;

import com.nemo.api.model.Campanha;
import com.nemo.api.model.Disparo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${nemo.tracking.base-url}")
    private String trackingBaseUrl;

    /**
     * Envia o e-mail de phishing simulado de forma assíncrona para um único disparo.
     * Substitui {{LINK_AQUI}} pelo link de rastreamento único do alvo.
     * Se a campanha tiver nomeAnexo configurado, injeta também o link do "anexo" falso.
     */
    @Async
    public void enviarEmailPhishing(Disparo disparo) {
        Campanha campanha = disparo.getCampanha();
        String token = disparo.getTokenUnico();
        String emailAlvo = disparo.getUsuarioDestino().getEmail();
        String nomeAlvo = disparo.getUsuarioDestino().getNome();

        String linkClique = trackingBaseUrl + "/confirmar/" + token;
        String linkAnexo  = trackingBaseUrl + "/doc/" + token;

        // Monta o corpo HTML substituindo os placeholders
        String corpoHtml = campanha.getModelo().getTextoHtml();
        corpoHtml = corpoHtml.replace("{{LINK_AQUI}}", linkClique);
        corpoHtml = corpoHtml.replace("{{LINK_ANEXO}}", linkAnexo);
        corpoHtml = corpoHtml.replace("{{NOME_ALVO}}", nomeAlvo);

        String remetenteFalso = campanha.getModelo().getRemetenteFalso();
        String assunto = campanha.getAssuntoEmail();

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String emailRemetente = remetenteFalso;
            String nomeRemetente = null;

            // Se o usuário preencheu "Nome do Remetente <email@dominio.com>"
            if (remetenteFalso.contains("<") && remetenteFalso.contains(">")) {
                int lastIdx = remetenteFalso.lastIndexOf("<");
                nomeRemetente = remetenteFalso.substring(0, lastIdx).trim();
                emailRemetente = remetenteFalso.substring(lastIdx + 1, remetenteFalso.indexOf(">", lastIdx)).trim();
            } else {
                nomeRemetente = extrairNomeRemetente(emailRemetente);
            }

            // Remetente com display name e charset UTF-8 (evita quebra de caracteres)
            helper.setFrom(new InternetAddress(emailRemetente, nomeRemetente, "UTF-8"));
            helper.setTo(emailAlvo);
            helper.setSubject(assunto);
            helper.setText(corpoHtml, true); // true = isHtml

            // Anexo simulado
            if (campanha.getNomeAnexo() != null && !campanha.getNomeAnexo().trim().isEmpty()) {
                String htmlAnexoFalso = "<html><body>" +
                        "<h2>Documento Confidencial</h2>" +
                        "<p>Para visualizar o conteúdo deste arquivo, por favor acesse a via segura clicando no link abaixo:</p>" +
                        "<a href=\"" + linkAnexo + "\">Visualizar Documento (" + campanha.getNomeAnexo() + ")</a>" +
                        "</body></html>";
                helper.addAttachment(campanha.getNomeAnexo() + ".html", new org.springframework.core.io.ByteArrayResource(htmlAnexoFalso.getBytes("UTF-8")), "text/html");
            }

            mailSender.send(message);
            log.info("[SMTP] E-mail enviado com sucesso → {} (campanha: {}, token: {})",
                    emailAlvo, campanha.getNomeCampanha(), token);

        } catch (org.springframework.mail.MailException e) {
            log.error("[SMTP] Falha síncrona do Postfix ao enviar e-mail para {} — {}", emailAlvo, e.getMessage());
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("[SMTP] Falha ao montar ou enviar e-mail para {} — {}", emailAlvo, e.getMessage());
        }
    }

    /**
     * Extrai um nome de exibição amigável do endereço de e-mail do remetente falso.
     * Ex: "ti@empresa.com" → "TI Empresa"
     *     "suporte@bradesco.acesso-seguro.top" → "Suporte Bradesco"
     */
    private String extrairNomeRemetente(String email) {
        if (email == null || !email.contains("@")) return "Noreply";
        String local = email.split("@")[0];
        String dominio = email.split("@")[1].split("\\.")[0];
        String nome = capitalize(local) + " " + capitalize(dominio);
        return nome.trim();
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }
}
