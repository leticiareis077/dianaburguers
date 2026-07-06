package com.lanchonete.dianaburgers_web.repository;

import com.lanchonete.dianaburgers_web.model.EnderecoModel;
import com.lanchonete.dianaburgers_web.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnderecoRepository extends JpaRepository<EnderecoModel, Integer> {

    boolean existsByCepAndUsuario(String cep, UsuarioModel usuario);
}
