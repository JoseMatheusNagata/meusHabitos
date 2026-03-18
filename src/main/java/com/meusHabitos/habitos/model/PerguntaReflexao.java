package com.meusHabitos.habitos.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "perguntas_reflexao")
public class PerguntaReflexao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String texto;

    @Column(nullable = false)
    private Boolean ativa; // Para desativar perguntas que já não quer usar

    @JsonIgnore
    @OneToMany(mappedBy = "pergunta_reflexao")
    private List<RespostaReflexao> respostaReflexao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean getAtiva() {
        return ativa;
    }

    public void setAtiva(Boolean ativa) {
        this.ativa = ativa;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public List<RespostaReflexao> getRespostaReflexao() {
        return respostaReflexao;
    }

    public void setRespostaReflexao(List<RespostaReflexao> respostaReflexao) {
        this.respostaReflexao = respostaReflexao;
    }
}