package com.lanchonete.dianaburgers_web.repository;

import com.lanchonete.dianaburgers_web.model.ProdutoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<ProdutoModel, Integer> {

    boolean existsByNome(String nome);
}
