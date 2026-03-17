package com.meusHabitos.habitos.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id //chave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento
    private Integer id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(name = "data_criacao")
    private LocalDate dataCriacao;

    // Um Usuário tem Muitos Hábitos
    @OneToMany(mappedBy = "usuario")
    private List<Habito> habitos;

    @OneToMany(mappedBy = "usuario")
    private List<RespostaReflexao> respostaReflexao;

    public Usuario() {
        this.dataCriacao = LocalDate.now();
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<RespostaReflexao> getRespostaReflexao() {
        return respostaReflexao;
    }

    public void setRespostaReflexao(List<RespostaReflexao> respostaReflexao) {
        this.respostaReflexao = respostaReflexao;
    }

    public List<Habito> getHabitos() {
        return habitos;
    }

    public void setHabitos(List<Habito> habitos) {
        this.habitos = habitos;
    }
}