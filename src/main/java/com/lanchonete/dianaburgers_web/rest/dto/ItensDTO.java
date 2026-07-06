package com.lanchonete.dianaburgers_web.rest.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItensDTO {
    private int idItem;
    private int idPedido;
    private int idProduto;
    private String nomeProduto;
    private int quantidade;
    private BigDecimal precoUnit;
}
