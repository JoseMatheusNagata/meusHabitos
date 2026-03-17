package com.meusHabitos.habitos.service;

import com.meusHabitos.habitos.model.RespostaReflexao;
import com.meusHabitos.habitos.repository.RespostaReflexaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RespostaReflexaoService {

    @Autowired
    private RespostaReflexaoRepository respostaRepository;

    public List<RespostaReflexao> listarTodas() {
        return respostaRepository.findAll();
    }

    public RespostaReflexao guardar(RespostaReflexao resposta) {
        return respostaRepository.save(resposta);
    }
}