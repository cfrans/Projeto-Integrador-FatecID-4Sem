package com.nemo.api.setor;

import com.nemo.api.repository.SetorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SetorService {

    private final SetorRepository setorRepository;

    public List<SetorDTO> listar() {
        return setorRepository.findAll().stream()
                .map(s -> new SetorDTO(s.getIdSetor(), s.getNomeSetor()))
                .toList();
    }
}
