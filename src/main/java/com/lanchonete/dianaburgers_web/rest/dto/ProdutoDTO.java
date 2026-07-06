package com.lanchonete.dianaburgers_web.rest.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProdutoDTO {
    private int idProduto;
    private String nome;
    private BigDecimal preco;
    private String descricao;
    private boolean disponivel;
    private Integer idCategoria;
    private String nomeCategoria;
    private String subcategoria;
    private BigDecimal custo;
    private String emoji;
    private String imagemBase64;
}
