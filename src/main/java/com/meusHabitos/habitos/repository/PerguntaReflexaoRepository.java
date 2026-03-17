package com.meusHabitos.habitos.repository;

import com.meusHabitos.habitos.model.PerguntaReflexao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PerguntaReflexaoRepository extends JpaRepository<PerguntaReflexao, Integer> {


}