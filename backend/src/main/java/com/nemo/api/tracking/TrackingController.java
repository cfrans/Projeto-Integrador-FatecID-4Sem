package com.nemo.api.tracking;

import com.nemo.api.repository.DisparoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class TrackingController {

    private final DisparoRepository disparoRepository;

    // ─── Rastrear clique no link ───────────────────────────────────────────────
    @GetMapping("/confirmar/{token}")
    public ResponseEntity<Void> registrarClique(@PathVariable String token) {
        var disparo = disparoRepository.findByTokenUnico(token);

        disparo.ifPresent(d -> {
            d.setClicouLink(true);
            disparoRepository.save(d);
        });

        // Redireciona para o domínio falso configurado no Modelo
        String redirect = disparo
                .map(d -> "https://" + d.getCampanha().getModelo().getDominioAlvo())
                .orElse("https://www.google.com");

        return ResponseEntity.status(302).header("Location", redirect).build();
    }

    // ─── Rastrear abertura do anexo + servir HTML falso ───────────────────────
    @GetMapping(value = "/doc/{token}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> registrarAnexo(@PathVariable String token) {
        var disparo = disparoRepository.findByTokenUnico(token);

        disparo.ifPresent(d -> {
            d.setAbriuAnexo(true);
            disparoRepository.save(d);
        });

        String nomeArquivo = disparo
                .map(d -> d.getCampanha().getNomeAnexo() != null
                        ? d.getCampanha().getNomeAnexo()
                        : "documento.pdf")
                .orElse("documento.pdf");

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(buildFakeDocHtml(nomeArquivo));
    }

    private String buildFakeDocHtml(String nomeArquivo) {
        return """
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>%s</title>
          <style>
            *{margin:0;padding:0;box-sizing:border-box}
            body{background:#404040;min-height:100vh;font-family:Arial,sans-serif;display:flex;flex-direction:column}
            .bar{background:#3a3a3a;padding:10px 20px;color:#ccc;font-size:13px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #2a2a2a}
            .icon{width:18px;height:18px;fill:#ccc}
            .wrap{flex:1;overflow:auto;padding:28px;display:flex;justify-content:center;align-items:flex-start}
            .page{background:#fff;width:min(794px,100%%);min-height:900px;padding:56px 64px;box-shadow:0 4px 24px rgba(0,0,0,.5)}
            .heading{border-bottom:2px solid #e0e0e0;padding-bottom:16px;margin-bottom:28px;text-align:center}
            .heading h1{font-size:18px;color:#1a1a1a}
            .heading p{font-size:11px;color:#999;margin-top:4px}
            body p{font-size:14px;line-height:1.8;color:#444;margin-bottom:12px}
            .warn{background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:16px 20px;margin:24px 0}
            .warn p{color:#856404;font-size:13px}
            .btn{display:inline-block;background:#0052cc;color:#fff;padding:11px 28px;border-radius:4px;text-decoration:none;font-size:14px;font-weight:bold;margin-top:14px}
            .overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#fff;z-index:999;transition:opacity .4s}
            .spin{width:44px;height:44px;border:4px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%%;animation:sp .8s linear infinite}
            @keyframes sp{to{transform:rotate(360deg)}}
          </style>
        </head>
        <body>
          <div class="bar">
            <svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>%s</span>
          </div>
          <div class="wrap">
            <div class="page">
              <div class="heading"><h1>DOCUMENTO CONFIDENCIAL</h1><p>Uso interno — não divulgar</p></div>
              <div class="warn">
                <p><strong>⚠ Acesso restrito.</strong> Para visualizar o conteúdo completo, realize a autenticação corporativa.</p>
                <a href="#" class="btn">Autenticar e Visualizar</a>
              </div>
              <p>Este documento contém informações confidenciais destinadas exclusivamente ao destinatário identificado. Qualquer acesso não autorizado é estritamente proibido.</p>
              <p>Em caso de recebimento indevido, entre em contato com o remetente imediatamente e exclua este arquivo.</p>
            </div>
          </div>
          <div class="overlay" id="ov"><div class="spin"></div><p>Carregando documento...</p></div>
          <script>
            setTimeout(()=>{
              const o=document.getElementById('ov');
              o.style.opacity='0';
              setTimeout(()=>o.remove(),400);
            },1800);
          </script>
        </body>
        </html>
        """.formatted(nomeArquivo, nomeArquivo);
    }
}