package com.nemo.api.graficos;

import com.nemo.api.model.Setor;
import com.nemo.api.repository.DisparoRepository;
import com.nemo.api.repository.SetorRepository;
import com.nemo.api.repository.UsuarioDestinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GraficosService {

    private static final String[] MESES_PT = {
            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    };
    private static final LocalDateTime EPOCH = LocalDateTime.of(1900, 1, 1, 0, 0);

    private final DisparoRepository disparoRepository;
    private final SetorRepository setorRepository;
    private final UsuarioDestinoRepository usuarioDestinoRepository;

    public DashboardDTO buildDashboard(String periodo) {
        LocalDateTime cutoff = resolveCutoff(periodo);

        return new DashboardDTO(
                buildTotais(cutoff),
                buildPorSetor(cutoff),
                buildEvolucao(cutoff),
                buildCampanhasRecentes(cutoff)
        );
    }

    private LocalDateTime resolveCutoff(String periodo) {
        if (periodo == null) return LocalDateTime.now().minusDays(30);
        return switch (periodo.toLowerCase()) {
            case "7d"  -> LocalDateTime.now().minusDays(7);
            case "30d" -> LocalDateTime.now().minusDays(30);
            case "6m"  -> LocalDateTime.now().minusMonths(6);
            case "tudo" -> EPOCH;
            default     -> LocalDateTime.now().minusDays(30);
        };
    }

    private DashboardDTO.Totais buildTotais(LocalDateTime cutoff) {
        List<Object[]> rows = disparoRepository.resumoNoPeriodo(cutoff);
        Object[] row = rows.isEmpty() ? new Object[]{0L, 0L, 0L, 0L} : rows.get(0);
        long total      = row[0] == null ? 0L : ((Number) row[0]).longValue();
        long cliques    = row[1] == null ? 0L : ((Number) row[1]).longValue();
        long reportes   = row[2] == null ? 0L : ((Number) row[2]).longValue();
        long campanhas  = row[3] == null ? 0L : ((Number) row[3]).longValue();

        int pctCliques  = total == 0 ? 0 : (int) Math.round((cliques  * 100.0) / total);
        int pctReportes = total == 0 ? 0 : (int) Math.round((reportes * 100.0) / total);

        long usuarios = usuarioDestinoRepository.count();
        return new DashboardDTO.Totais(campanhas, usuarios, pctCliques, pctReportes);
    }

    private List<DashboardDTO.SetorMetrica> buildPorSetor(LocalDateTime cutoff) {
        Map<String, long[]> porSetor = new LinkedHashMap<>();
        // Garante que todo setor aparece, mesmo zerado
        for (Setor s : setorRepository.findAll()) {
            porSetor.put(s.getNomeSetor(), new long[]{0, 0, 0});
        }

        for (Object[] row : disparoRepository.agregarPorSetor(cutoff)) {
            String nome     = (String) row[0];
            long cliques    = row[1] == null ? 0 : ((Number) row[1]).longValue();
            long anexos     = row[2] == null ? 0 : ((Number) row[2]).longValue();
            long reportes   = row[3] == null ? 0 : ((Number) row[3]).longValue();
            porSetor.put(nome, new long[]{cliques, anexos, reportes});
        }

        List<DashboardDTO.SetorMetrica> out = new ArrayList<>();
        porSetor.forEach((nome, valores) ->
                out.add(new DashboardDTO.SetorMetrica(nome, valores[0], valores[1], valores[2])));
        return out;
    }

    private List<DashboardDTO.EvolucaoMes> buildEvolucao(LocalDateTime cutoff) {
        List<DashboardDTO.EvolucaoMes> out = new ArrayList<>();
        Map<String, long[]> mapa = new HashMap<>();

        for (Object[] row : disparoRepository.agregarPorMes(cutoff)) {
            int ano       = ((Number) row[0]).intValue();
            int mes       = ((Number) row[1]).intValue();
            long cliques  = row[2] == null ? 0 : ((Number) row[2]).longValue();
            long reportes = row[3] == null ? 0 : ((Number) row[3]).longValue();
            mapa.put(ano + "-" + mes, new long[]{cliques, reportes});
        }

        // Itera do cutoff ate o mes atual emitindo cada mes (com zero quando nao houver dados)
        LocalDateTime inicio = cutoff.isBefore(LocalDateTime.now().minusMonths(12))
                ? LocalDateTime.now().minusMonths(11)
                : cutoff;
        int anoIni = inicio.getYear();
        int mesIni = inicio.getMonthValue();
        int anoFim = LocalDateTime.now().getYear();
        int mesFim = LocalDateTime.now().getMonthValue();

        int ano = anoIni, mes = mesIni;
        while (ano < anoFim || (ano == anoFim && mes <= mesFim)) {
            long[] valores = mapa.getOrDefault(ano + "-" + mes, new long[]{0, 0});
            out.add(new DashboardDTO.EvolucaoMes(MESES_PT[mes - 1], ano, mes, valores[0], valores[1]));
            mes++;
            if (mes > 12) { mes = 1; ano++; }
        }
        return out;
    }

    private List<DashboardDTO.CampanhaRecente> buildCampanhasRecentes(LocalDateTime cutoff) {
        List<DashboardDTO.CampanhaRecente> out = new ArrayList<>();
        for (Object[] row : disparoRepository.campanhasRecentes(cutoff)) {
            out.add(new DashboardDTO.CampanhaRecente(
                    (Integer) row[0],
                    (LocalDateTime) row[1],
                    (String) row[2],
                    row[3] == null ? 0 : ((Number) row[3]).longValue(),
                    row[4] == null ? 0 : ((Number) row[4]).longValue(),
                    row[5] == null ? 0 : ((Number) row[5]).longValue()
            ));
            if (out.size() >= 8) break;
        }
        return out;
    }
}
