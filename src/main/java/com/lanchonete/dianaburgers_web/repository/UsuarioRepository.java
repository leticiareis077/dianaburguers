package com.lanchonete.dianaburgers_web.repository;

import com.lanchonete.dianaburgers_web.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Integer> {

    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    boolean existsByTelefone(String telefone);

    java.util.Optional<UsuarioModel> findByEmail(String email);
}
