package com.meusHabitos.habitos.controller;

import com.meusHabitos.habitos.model.RegistroHabito;
import com.meusHabitos.habitos.service.RegistroHabitoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registos-habito")
public class RegistroHabitoController {

    @Autowired
    private RegistroHabitoService registroHabitoService;

    @GetMapping
    public List<RegistroHabito> listarRegistos() {
        return registroHabitoService.listarTodos();
    }

    @PostMapping
    public RegistroHabito criarRegisto(@RequestBody RegistroHabito registo) {
        return registroHabitoService.salvar(registo);
    }
}