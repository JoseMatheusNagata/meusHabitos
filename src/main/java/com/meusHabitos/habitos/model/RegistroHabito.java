package com.meusHabitos.habitos.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "registro_habitos")
public class RegistroHabito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "data_registro", nullable = false)
    private LocalDate dataRegistro;

    @Column(nullable = false)
    private Boolean feito;

    // Muitos registos diários pertencem a Um Hábito base
    @ManyToOne
    @JoinColumn(name = "habito_id", nullable = false)
    private Habito habito;

    public RegistroHabito() {
        this.dataRegistro = LocalDate.now(); // Grava o dia exato do "check"
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Habito getHabito() {
        return habito;
    }

    public void setHabito(Habito habito) {
        this.habito = habito;
    }

    public Boolean getFeito() {
        return feito;
    }

    public void setFeito(Boolean feito) {
        this.feito = feito;
    }

    public LocalDate getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDate dataRegistro) {
        this.dataRegistro = dataRegistro;
    }
}