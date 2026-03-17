package com.meusHabitos.habitos.controller;

import com.meusHabitos.habitos.model.RespostaReflexao;
import com.meusHabitos.habitos.service.RespostaReflexaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/respostas")
public class RespostaReflexaoController {

    @Autowired
    private RespostaReflexaoService respostaService;

    @GetMapping
    public List<RespostaReflexao> listarRespostas() {
        return respostaService.listarTodas();
    }

    @PostMapping
    public RespostaReflexao criarResposta(@RequestBody RespostaReflexao resposta) {
        return respostaService.guardar(resposta);
    }
}