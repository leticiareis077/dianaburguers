package com.lanchonete.dianaburgers_web.rest.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PedidoDTO {
    private int idPedido;
    private int idUsuario;
    private String nomeUsuario;
    private String telefoneUsuario;
    private LocalDateTime dataPedido;
    private String status;
    private String formaPag;
    private BigDecimal valorTotal;
    private String tipoEntrega;
    private String enderecoEntregaTexto;
    private String observacao;
}
