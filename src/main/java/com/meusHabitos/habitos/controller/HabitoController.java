package com.meusHabitos.habitos.controller;

import com.meusHabitos.habitos.model.Habito;
import com.meusHabitos.habitos.service.HabitoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/habitos")
public class HabitoController {

    @Autowired
    private HabitoService habitoService;

    @GetMapping
    public List<Habito> listarHabitos() {
        return habitoService.listarTodos();
    }

    @PostMapping
    public Habito criarHabito(@RequestBody Habito habito) {
        return habitoService.salvar(habito);
    }
}