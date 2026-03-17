package com.meusHabitos.habitos.service;

import com.meusHabitos.habitos.model.PerguntaReflexao;
import com.meusHabitos.habitos.repository.PerguntaReflexaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PerguntaReflexaoService {

    @Autowired
    private PerguntaReflexaoRepository perguntaRepository;

    public List<PerguntaReflexao> listarTodas() {
        return perguntaRepository.findAll();
    }

    public PerguntaReflexao guardar(PerguntaReflexao pergunta) {
        return perguntaRepository.save(pergunta);
    }
}