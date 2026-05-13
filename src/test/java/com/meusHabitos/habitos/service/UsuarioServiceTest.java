package com.meusHabitos.habitos.service;

import com.meusHabitos.habitos.model.Usuario;
import com.meusHabitos.habitos.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Diz ao JUnit para usar o Mockito
public class UsuarioServiceTest {

    @Mock // Cria um repositório "falso" (não vai ao banco de dados real)
    private UsuarioRepository usuarioRepository;

    @InjectMocks // Cria o Service de verdade, mas injeta o repositório falso lá dentro
    private UsuarioService usuarioService;

    @Test
    public void autenticar_ComCredenciaisValidas_DeveRetornarUsuario() {
        // 1. ARRANGE (Preparar o cenário)
        Usuario usuarioMock = new Usuario();
        usuarioMock.setId(1);
        usuarioMock.setNome("Matheus");
        usuarioMock.setEmail("matheus@email.com");
        usuarioMock.setSenha("senha123");

        // Ensinamos o repositório falso: "Quando alguém procurar por este email e senha, devolva o usuarioMock"
        when(usuarioRepository.findByEmailAndSenha("matheus@email.com", "senha123"))
                .thenReturn(Optional.of(usuarioMock));

        // 2. ACT (Agir - chamar o método que queremos testar)
        Usuario resultado = usuarioService.autenticar("matheus@email.com", "senha123");

        // 3. ASSERT (Verificar se o resultado foi o esperado)
        assertNotNull(resultado, "O utilizador não deveria ser nulo");
        assertEquals("Matheus", resultado.getNome(), "O nome retornado deveria ser Matheus");
        assertEquals("matheus@email.com", resultado.getEmail(), "O email deveria corresponder");
    }

    @Test
    public void autenticar_ComCredenciaisInvalidas_DeveRetornarNull() {
        // 1. ARRANGE
        // Ensinamos: "Quando procurarem com email errado, não devolva nada (Optional.empty)"
        when(usuarioRepository.findByEmailAndSenha("errado@email.com", "senhaerrada"))
                .thenReturn(Optional.empty());

        // 2. ACT
        Usuario resultado = usuarioService.autenticar("errado@email.com", "senhaerrada");

        // 3. ASSERT
        assertNull(resultado, "O resultado deveria ser nulo para credenciais inválidas");
    }
}