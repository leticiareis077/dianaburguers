package com.lanchonete.dianaburgers_web.repository;

import com.lanchonete.dianaburgers_web.model.PedidoModel;
import com.lanchonete.dianaburgers_web.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<PedidoModel, Integer> {

    List<PedidoModel> findByUsuario(UsuarioModel usuario);
}
