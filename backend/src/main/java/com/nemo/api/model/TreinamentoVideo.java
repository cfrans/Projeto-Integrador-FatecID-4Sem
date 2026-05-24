package com.nemo.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "treinamento_video")
public class TreinamentoVideo extends Treinamento {

    private String youtubeId;
    
    private Integer duracaoMinutos;
}
