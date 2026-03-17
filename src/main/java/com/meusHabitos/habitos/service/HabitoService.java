package com.meusHabitos.habitos.service;


import com.meusHabitos.habitos.model.Habito;
import com.meusHabitos.habitos.repository.HabitoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HabitoService {

    @Autowired
    private HabitoRepository habitoRepository;

    public List<Habito> listarTodos() {
        return habitoRepository.findAll();
    }

    public Habito salvar(Habito habito) {
        return habitoRepository.save(habito);
    }
}