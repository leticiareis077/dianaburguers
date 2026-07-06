package com.lanchonete.dianaburgers_web.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "itens")
@Entity
public class ItensModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private int idItem;

    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private PedidoModel pedido;

    @ManyToOne
    @JoinColumn(name = "id_produto", nullable = false)
    private ProdutoModel produto;

    @NotNull(message = "A quantidade não pode ser nula.")
    @Min(value = 1, message = "A quantidade deve ser no mínimo 1.")
    @Column(name = "quantidade", nullable = false)
    private int quantidade;

    @NotNull(message = "O preço unitário não pode ser nulo.")
    @DecimalMin(value = "0.01", message = "O preço unitário deve ser maior que zero.")
    @Column(name = "preco_unit", precision = 10, scale = 2, nullable = false)
    private BigDecimal precoUnit;
}
