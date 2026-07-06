package com.lanchonete.dianaburgers_web.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "pedido")
@Entity
public class PedidoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private int idPedido;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private UsuarioModel usuario;

    /** Preenchido automaticamente pelo @PrePersist — não validar na entrada. */
    @Column(name = "data_pedido", nullable = false)
    private LocalDateTime dataPedido;

    /** Valor padrão definido pelo @PrePersist quando não informado. */
    @Column(name = "status", length = 255, nullable = false)
    private String status;

    @NotNull(message = "A forma de pagamento não pode ser nula.")
    @NotBlank(message = "A forma de pagamento é obrigatória.")
    @Column(name = "forma_pag", length = 255, nullable = false)
    private String formaPag;

    @NotNull(message = "O valor total não pode ser nulo.")
    @DecimalMin(value = "0.01", message = "O valor total deve ser maior que zero.")
    @Column(name = "valor_total", precision = 10, scale = 2, nullable = false)
    private BigDecimal valorTotal;

    /** "delivery" ou "retirada". */
    @Column(name = "tipo_entrega", length = 20)
    private String tipoEntrega = "retirada";

    @Column(name = "endereco_entrega_texto", columnDefinition = "TEXT")
    private String enderecoEntregaTexto;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    @PrePersist
    public void prePersist() {
        this.dataPedido = LocalDateTime.now();
        if (this.status == null || this.status.isBlank()) {
            this.status = "em preparo";
        }
        if (this.tipoEntrega == null || this.tipoEntrega.isBlank()) {
            this.tipoEntrega = "retirada";
        }
    }
}
