package com.lanchonete.dianaburgers_web.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "categoria")
@Entity
public class CategoriaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private int idCategoria;

    @NotNull(message = "O nome da categoria não pode ser nulo.")
    @NotBlank(message = "O nome da categoria é obrigatório.")
    @Column(name = "nome", length = 255, nullable = false, unique = true)
    private String nome;
}
