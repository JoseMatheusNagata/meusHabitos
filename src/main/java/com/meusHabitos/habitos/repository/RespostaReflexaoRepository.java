package com.meusHabitos.habitos.repository;

import com.meusHabitos.habitos.model.RespostaReflexao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RespostaReflexaoRepository extends JpaRepository<RespostaReflexao, Integer> {


}
