package com.nemo.api.graficos;

import java.time.LocalDateTime;
import java.util.List;

public record DashboardDTO(
        Totais totais,
        List<SetorMetrica> porSetor,
        List<EvolucaoMes> evolucao,
        List<CampanhaRecente> campanhasRecentes
) {
    public record Totais(
            long campanhas,
            long usuarios,
            int percentualCliques,
            int percentualReportes
    ) {}

    public record SetorMetrica(
            String setor,
            long cliques,
            long anexos,
            long reportes
    ) {}

    public record EvolucaoMes(
            String label,
            int ano,
            int mes,
            long cliques,
            long reportes
    ) {}

    public record CampanhaRecente(
            Integer id,
            LocalDateTime data,
            String nome,
            long alvos,
            long cliques,
            long reportes
    ) {}
}
