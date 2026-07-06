package com.lanchonete.dianaburgers_web.repository;

import com.lanchonete.dianaburgers_web.model.EnderecoEntregaModel;
import com.lanchonete.dianaburgers_web.model.PedidoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnderecoEntregaRepository extends JpaRepository<EnderecoEntregaModel, Integer> {

    boolean existsByPedido(PedidoModel pedido);
}
