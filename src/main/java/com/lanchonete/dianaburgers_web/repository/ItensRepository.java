package com.lanchonete.dianaburgers_web.repository;

import com.lanchonete.dianaburgers_web.model.ItensModel;
import com.lanchonete.dianaburgers_web.model.PedidoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItensRepository extends JpaRepository<ItensModel, Integer> {

    List<ItensModel> findByPedido(PedidoModel pedido);
}
