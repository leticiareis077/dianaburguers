package com.lanchonete.dianaburgers_web.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.br.CPF;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "usuario")
@Entity
public class UsuarioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @NotNull(message = "O nome não pode ser nulo.")
    @NotBlank(message = "O nome é obrigatório.")
    @Column(name = "nome", length = 255, nullable = false)
    private String nome;

    @NotNull(message = "O e-mail não pode ser nulo.")
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Formato de e-mail inválido.")
    @Column(name = "email", length = 255, nullable = false, unique = true)
    private String email;

    @NotNull(message = "A senha não pode ser nula.")
    @NotBlank(message = "A senha é obrigatória.")
    @Column(name = "senhaUsuario", length = 255, nullable = false)
    private String senhaUsuario;

    @NotNull(message = "O CPF não pode ser nulo.")
    @NotBlank(message = "O CPF é obrigatório.")
    @CPF(message = "CPF inválido.")
    @Column(name = "cpf", length = 11, nullable = false, unique = true)
    private String cpf;

    @NotNull(message = "O telefone não pode ser nulo.")
    @NotBlank(message = "O telefone é obrigatório.")
    @Column(name = "telefone", length = 11, nullable = false, unique = true)
    private String telefone;

    /** Valores esperados: "cliente", "funcionario" ou "admin". */
    @Column(name = "role", length = 20, nullable = false)
    private String role = "cliente";
}
