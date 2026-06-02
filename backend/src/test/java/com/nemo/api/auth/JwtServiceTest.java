package com.nemo.api.auth;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Testes de unidade do {@link JwtService} — sem subir contexto Spring nem banco.
 * Os campos {@code @Value} são injetados via reflexão.
 */
class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // A chave precisa ter >= 256 bits (32 bytes) para HMAC-SHA256.
        ReflectionTestUtils.setField(jwtService, "secret",
                "chave-secreta-de-teste-com-mais-de-32-bytes-1234567890");
        ReflectionTestUtils.setField(jwtService, "expirationMs", 86_400_000L);
    }

    @Test
    void gera_token_e_extrai_o_email_do_subject() {
        String token = jwtService.generate("user@nemo.com", Map.of("role", "Admin"));

        assertFalse(token.isBlank());
        assertEquals("user@nemo.com", jwtService.extractEmail(token));
    }

    @Test
    void token_expirado_lanca_ExpiredJwtException() {
        ReflectionTestUtils.setField(jwtService, "expirationMs", -1_000L); // já nasce expirado
        String token = jwtService.generate("user@nemo.com", Map.of());

        assertThrows(ExpiredJwtException.class, () -> jwtService.extractEmail(token));
    }

    @Test
    void token_adulterado_falha_na_verificacao_de_assinatura() {
        String token = jwtService.generate("user@nemo.com", Map.of());
        String adulterado = token.substring(0, token.length() - 2) + "xx";

        assertThrows(JwtException.class, () -> jwtService.extractEmail(adulterado));
    }
}
