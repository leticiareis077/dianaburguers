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
@Table(name = "endereco")
@Entity
public class EnderecoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_endereco")
    private int idEndereco;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private UsuarioModel usuario;

    @NotNull(message = "O logradouro não pode ser nulo.")
    @NotBlank(message = "O logradouro é obrigatório.")
    @Column(name = "logradouro", length = 255, nullable = false)
    private String logradouro;

    @NotNull(message = "O CEP não pode ser nulo.")
    @NotBlank(message = "O CEP é obrigatório.")
    @Column(name = "cep", length = 8, nullable = false)
    private String cep;

    @NotNull(message = "O número da casa não pode ser nulo.")
    @NotBlank(message = "O número da casa é obrigatório.")
    @Column(name = "numeroCasa", length = 10, nullable = false)
    private String numeroCasa;

    @NotNull(message = "A cidade não pode ser nula.")
    @NotBlank(message = "A cidade é obrigatória.")
    @Column(name = "cidade", length = 255, nullable = false)
    private String cidade;

    @NotNull(message = "O bairro não pode ser nulo.")
    @NotBlank(message = "O bairro é obrigatório.")
    @Column(name = "bairro", length = 255, nullable = false)
    private String bairro;
}
