package com.lanchonete.dianaburgers_web.repository;

import com.lanchonete.dianaburgers_web.model.CategoriaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaModel, Integer> {

    boolean existsByNome(String nome);
}
