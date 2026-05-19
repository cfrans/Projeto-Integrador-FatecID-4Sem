package com.nemo.api.graficos;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/graficos")
@RequiredArgsConstructor
public class GraficosController {

    private final GraficosService graficosService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> dashboard(
            @RequestParam(value = "periodo", required = false, defaultValue = "30d") String periodo
    ) {
        return ResponseEntity.ok(graficosService.buildDashboard(periodo));
    }
}
