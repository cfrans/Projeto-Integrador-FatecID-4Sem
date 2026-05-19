package com.nemo.api.graficos;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/graficos")
@RequiredArgsConstructor
public class GraficosController {

    private final GraficosService graficosService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> dashboard(
            @RequestParam(value = "periodo", required = false, defaultValue = "30d") String periodo,
            @RequestParam(value = "dataInicio", required = false)
                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(value = "dataFim", required = false)
                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @RequestParam(value = "idSetor",  required = false) Integer idSetor,
            @RequestParam(value = "idModelo", required = false) Integer idModelo
    ) {
        return ResponseEntity.ok(graficosService.buildDashboard(periodo, dataInicio, dataFim, idSetor, idModelo));
    }
}
