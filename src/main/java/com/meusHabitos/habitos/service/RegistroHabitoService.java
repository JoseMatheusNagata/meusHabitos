package com.meusHabitos.habitos.service;

import com.meusHabitos.habitos.model.RegistroHabito;
import com.meusHabitos.habitos.repository.RegistroHabitoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistroHabitoService {

    @Autowired
    private RegistroHabitoRepository registroHabitoRepository;

    public List<RegistroHabito> listarTodos() {
        return registroHabitoRepository.findAll();
    }

    public RegistroHabito salvar(RegistroHabito registro) {
        return registroHabitoRepository.save(registro);
    }
}