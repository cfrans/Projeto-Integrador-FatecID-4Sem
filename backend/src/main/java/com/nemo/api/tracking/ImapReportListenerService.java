package com.nemo.api.tracking;

import jakarta.mail.*;
import jakarta.mail.search.FlagTerm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
@ConditionalOnProperty(name = "nemo.imap.enabled", havingValue = "true")
public class ImapReportListenerService {

    private final TrackingService trackingService;

    @Value("${nemo.imap.username}")
    private String username;

    @Value("${nemo.imap.password}")
    private String password;

    // Procura por tokens nos links do modelo: /confirmar/{token} ou /doc/{token}
    private static final Pattern TOKEN_PATTERN = Pattern.compile("(?:confirmar|doc)/([A-Za-z0-9_-]+)");

    @Scheduled(fixedDelayString = "${nemo.imap.polling-delay:60000}")
    public void verificarCaixaDeDenuncias() {
        log.info("[IMAP] Verificando nova caixa de denúncias para: {}", username);
        
        Properties props = new Properties();
        props.put("mail.store.protocol", "imaps");
        props.put("mail.imaps.host", "imap.gmail.com");
        props.put("mail.imaps.port", "993");
        props.put("mail.imaps.timeout", "10000");

        try (Store store = Session.getInstance(props, null).getStore("imaps")) {
            store.connect("imap.gmail.com", username, password);

            processarPasta(store, "INBOX");
            processarPasta(store, "[Gmail]/Spam");

        } catch (AuthenticationFailedException e) {
            log.error("[IMAP] Erro de autenticação no Gmail. Verifique o usuário e a Senha de Aplicativo.", e);
        } catch (MessagingException e) {
            log.error("[IMAP] Erro de comunicação com o servidor IMAP do Gmail.", e);
        }
    }

    private void processarPasta(Store store, String folderName) {
        try (Folder folder = store.getFolder(folderName)) {
            if (!folder.exists()) {
                return;
            }
            folder.open(Folder.READ_WRITE);

            // Busca apenas e-mails não lidos
            Message[] messages = folder.search(new FlagTerm(new Flags(Flags.Flag.SEEN), false));
            
            if (messages.length > 0) {
                log.info("[IMAP] Encontrados {} e-mails não lidos na pasta {}.", messages.length, folderName);
            }

            for (Message message : messages) {
                try {
                    String content = extrairTexto(message);
                    Matcher matcher = TOKEN_PATTERN.matcher(content);
                    
                    java.util.Set<String> tokensProcessados = new java.util.HashSet<>();
                    boolean achouToken = false;
                    while (matcher.find()) {
                        String token = matcher.group(1);
                        if (!tokensProcessados.add(token)) {
                            continue; // Evita registrar o mesmo token repetidas vezes se ele aparecer em text/plain e text/html
                        }
                        log.info("[IMAP] Token '{}' extraído do e-mail (pasta {}). Registrando reporte de phishing...", token, folderName);
                        try {
                            trackingService.registrarReporte(token);
                            achouToken = true;
                        } catch (Exception e) {
                            log.error("[IMAP] Erro ao registrar reporte para o token: {}", token, e);
                        }
                    }
                    
                    if (!achouToken) {
                        log.warn("[IMAP] Nenhum token válido encontrado no e-mail: {}", message.getSubject());
                    }

                    // Marca a mensagem como lida
                    message.setFlag(Flags.Flag.SEEN, true);
                } catch (Exception e) {
                    log.error("[IMAP] Erro ao processar e-mail individual", e);
                }
            }
        } catch (MessagingException e) {
            log.warn("[IMAP] Não foi possível acessar a pasta {} - {}", folderName, e.getMessage());
        }
    }

    /**
     * Extrai o conteúdo textual de uma Message (suporta multipart/mixed e text/plain)
     */
    private String extrairTexto(Part part) throws MessagingException, IOException {
        if (part.isMimeType("text/plain")) {
            return (String) part.getContent();
        } else if (part.isMimeType("text/html")) {
            return (String) part.getContent();
        } else if (part.isMimeType("multipart/*")) {
            Multipart multipart = (Multipart) part.getContent();
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < multipart.getCount(); i++) {
                BodyPart bodyPart = multipart.getBodyPart(i);
                result.append(extrairTexto(bodyPart));
            }
            return result.toString();
        }
        return "";
    }
}
