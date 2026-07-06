package com.lanchonete.dianaburgers_web.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "produto")
@Entity
public class ProdutoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produto")
    private int idProduto;

    @NotNull(message = "O nome não pode ser nulo.")
    @NotBlank(message = "O nome é obrigatório.")
    @Column(name = "nome", length = 255, nullable = false)
    private String nome;

    @NotNull(message = "O preço não pode ser nulo.")
    @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero.")
    @Column(name = "preco", precision = 10, scale = 2, nullable = false)
    private BigDecimal preco;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "disponivel", nullable = false)
    private boolean disponivel = true;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private CategoriaModel categoria;

    @Column(name = "subcategoria", length = 100)
    private String subcategoria;

    @Column(name = "custo", precision = 10, scale = 2)
    private BigDecimal custo;

    @Column(name = "emoji", length = 8)
    private String emoji;

    /** Imagem do produto em base64 (data URI), já comprimida no navegador antes do envio. */
    @Column(name = "imagem_base64", columnDefinition = "TEXT")
    private String imagemBase64;
}
