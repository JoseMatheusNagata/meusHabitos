package com.meusHabitos.habitos.controller;


import com.meusHabitos.habitos.model.Usuario;
import com.meusHabitos.habitos.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios") // Qual endereço da web vai acessar essa classe
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Quando o Front-end fizer um GET em http://localhost:8080/usuarios
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarTodos();
    }

    // Quando o Front-end fizer um POST enviando dados para salvar
    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.salvar(usuario);
    }

    // post para quanto o usuario fizer o login
    @PostMapping("/login")
    public ResponseEntity<Usuario> fazerLogin(@RequestBody Usuario dadosLogin) {
        Usuario usuarioLogado = usuarioService.autenticar(dadosLogin.getEmail(), dadosLogin.getSenha());

        if (usuarioLogado != null) {
            return ResponseEntity.ok(usuarioLogado);
        } else {
            return ResponseEntity.status(401).build();
        }
    }
}