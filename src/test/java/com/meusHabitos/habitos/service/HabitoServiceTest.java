package com.meusHabitos.habitos.service;

import com.meusHabitos.habitos.model.Categoria;
import com.meusHabitos.habitos.model.Habito;
import com.meusHabitos.habitos.model.Usuario;
import com.meusHabitos.habitos.repository.HabitoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class HabitoServiceTest {

    @Mock
    private HabitoRepository habitoRepository;

    @InjectMocks
    private HabitoService habitoService;

    @Test
    public void listarTodos_DeveRetornarListaDeHabitos() {
        // 1. ARRANGE
        List<Habito> listaFalsa = new ArrayList<>();
        Habito habito1 = new Habito();
        habito1.setNome("Ler 10 páginas");
        listaFalsa.add(habito1);

        // Ensinamos: Quando pedirem para buscar tudo, devolva a nossa lista falsa com 1 hábito
        when(habitoRepository.findAll()).thenReturn(listaFalsa);

        // 2. ACT
        List<Habito> resultado = habitoService.listarTodos();

        // 3. ASSERT
        assertNotNull(resultado, "A lista não deveria ser nula");
        assertEquals(1, resultado.size(), "A lista deveria conter exatamente 1 hábito");
        assertEquals("Ler 10 páginas", resultado.get(0).getNome());

        // Verifica se o método findAll do repositório foi chamado exatamente 1 vez
        verify(habitoRepository, times(1)).findAll();
    }

    @Test
    public void salvar_DeveRetornarHabitoSalvo() {
        // 1. ARRANGE
        Habito novoHabito = new Habito();
        novoHabito.setNome("Beber Água");

        Habito habitoSalvo = new Habito();
        habitoSalvo.setId(1); // O banco de dados (falso) gerou um ID
        habitoSalvo.setNome("Beber Água");

        // Ensinamos: Quando tentarem salvar QUALQUER hábito, devolva o hábito com ID
        when(habitoRepository.save(any(Habito.class))).thenReturn(habitoSalvo);

        // 2. ACT
        Habito resultado = habitoService.salvar(novoHabito);

        // 3. ASSERT
        assertNotNull(resultado);
        assertEquals(1, resultado.getId(), "O hábito salvo deve ter recebido um ID");
        assertEquals("Beber Água", resultado.getNome());
    }
}