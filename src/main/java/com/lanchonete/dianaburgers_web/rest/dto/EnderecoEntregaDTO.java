package com.lanchonete.dianaburgers_web.rest.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EnderecoEntregaDTO {
    private int idEntrega;
    private String status;
    private LocalDate dataEntrega;
}
