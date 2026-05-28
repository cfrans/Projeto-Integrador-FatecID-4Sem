package com.nemo.api.tracking;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    // ─── Rastrear clique no link ───────────────────────────────────────────────
    @GetMapping("/confirmar/{token}")
    public ResponseEntity<Void> registrarClique(@PathVariable String token) {
        String redirect = trackingService.registrarClique(token);
        return ResponseEntity.status(302).header("Location", redirect).build();
    }

    // ─── Rastrear abertura do anexo + servir HTML falso ───────────────────────
    @GetMapping(value = "/doc/{token}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> registrarAnexo(@PathVariable String token) {
        String nomeArquivo = trackingService.registrarAnexo(token);
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(trackingService.buildFakeDocHtml(nomeArquivo));
    }

    // ─── Webhook para receber reportes da Abuse Inbox ─────────────────────────
    @PostMapping("/api/tracking/webhook/reporte/{token}")
    public ResponseEntity<Void> receberReportePhishing(@PathVariable String token) {
        trackingService.registrarReporte(token);
        return ResponseEntity.ok().build();
    }
}