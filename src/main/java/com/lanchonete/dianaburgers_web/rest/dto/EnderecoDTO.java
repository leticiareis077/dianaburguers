package com.lanchonete.dianaburgers_web.rest.dto;

import lombok.Data;

@Data
public class EnderecoDTO {
    private int idEndereco;
    private String logradouro;
    private String cep;
    private String numeroCasa;
    private String cidade;
    private String bairro;
}
