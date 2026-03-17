package com.meusHabitos.habitos.service;


import com.meusHabitos.habitos.model.Usuario;
import com.meusHabitos.habitos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Diz ao Spring que esta é a classe de regras de negócio
public class UsuarioService {

    @Autowired // O Spring injeta o repositório automaticamente aqui
    private UsuarioRepository usuarioRepository;

    // Método para listar todos os usuários
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // Método para salvar um novo usuário
    public Usuario salvar(Usuario usuario) {
        // Aqui no futuro você pode colocar regras, como criptografar a senha!
        return usuarioRepository.save(usuario);
    }
}