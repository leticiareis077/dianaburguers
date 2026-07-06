package com.lanchonete.dianaburgers_web.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "endereco_entrega")
@Entity
public class EnderecoEntregaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_entrega")
    private int idEntrega;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private UsuarioModel usuario;

    @ManyToOne
    @JoinColumn(name = "id_endereco", nullable = false)
    private EnderecoModel endereco;

    @OneToOne
    @JoinColumn(name = "id_pedido", nullable = false, unique = true)
    private PedidoModel pedido;

    @NotNull(message = "O status não pode ser nulo.")
    @NotBlank(message = "O status é obrigatório.")
    @Column(name = "status", length = 255, nullable = false)
    private String status;

    @Column(name = "data_entrega", nullable = true)
    private LocalDate dataEntrega;


}
