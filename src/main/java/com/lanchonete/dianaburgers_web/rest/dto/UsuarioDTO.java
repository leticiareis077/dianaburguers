package com.lanchonete.dianaburgers_web.rest.dto;

import lombok.Data;

@Data
public class UsuarioDTO {
    private int id;
    private String nome;
    private String email;
    private String cpf;
    private String telefone;
    private String senhaUsuario;
    private String role;
}
