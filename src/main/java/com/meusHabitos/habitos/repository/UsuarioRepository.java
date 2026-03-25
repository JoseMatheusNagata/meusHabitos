package com.meusHabitos.habitos.repository;


import com.meusHabitos.habitos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    // Só com isto, o Java já sabe guardar, procurar e apagar utilizadores!
    // Podemos adicionar buscas personalizadas depois, por exemplo:
    // Usuario findByEmail(String email);
    //procura o usuario pelo email e senha
    Optional<Usuario> findByEmailAndSenha(String email, String senha);
}