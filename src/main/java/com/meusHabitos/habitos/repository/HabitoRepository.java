package com.meusHabitos.habitos.repository;

import com.meusHabitos.habitos.model.Habito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitoRepository extends JpaRepository<Habito, Integer> {


}