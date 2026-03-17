package com.meusHabitos.habitos.controller;

import com.meusHabitos.habitos.model.PerguntaReflexao;
import com.meusHabitos.habitos.service.PerguntaReflexaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/perguntas")
public class PerguntaReflexaoController {

    @Autowired
    private PerguntaReflexaoService perguntaService;

    @GetMapping
    public List<PerguntaReflexao> listarPerguntas() {
        return perguntaService.listarTodas();
    }

    @PostMapping
    public PerguntaReflexao criarPergunta(@RequestBody PerguntaReflexao pergunta) {
        return perguntaService.guardar(pergunta);
    }
}