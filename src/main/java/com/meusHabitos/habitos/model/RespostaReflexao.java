package com.meusHabitos.habitos.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "respostas_reflexao")
public class RespostaReflexao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String resposta;

    @Column(name = "data_registro", nullable = false)
    private LocalDate dataRegistro;

    // A resposta pertence a Um Utilizador
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // A resposta é referente a Uma Pergunta específica
    @ManyToOne
    @JoinColumn(name = "pergunta_id", nullable = false)
    private PerguntaReflexao pergunta_reflexao;

    public RespostaReflexao() {
        this.dataRegistro = LocalDate.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public PerguntaReflexao getPergunta_reflexao() {
        return pergunta_reflexao;
    }

    public void setPergunta_reflexao(PerguntaReflexao pergunta_reflexao) {
        this.pergunta_reflexao = pergunta_reflexao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDate getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDate dataRegistro) {
        this.dataRegistro = dataRegistro;
    }

    public String getResposta() {
        return resposta;
    }

    public void setResposta(String resposta) {
        this.resposta = resposta;
    }
}