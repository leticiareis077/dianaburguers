package com.lanchonete.dianaburgers_web.model.enuns;

import lombok.Getter;

@Getter
public enum StatusEntrega {

    RECEBIDO("RE", "Pedido recebido na lanchonete"),
    EM_PREPARACAO("EM", "Lanche sendo preparado"),
    PRONTO("P", "Lanche pronto para envio"),
    SAIU_PARA_ENTREGA("S", "Entregador a caminho"),
    ENTREGUE("EN", "Pedido entregue com sucesso"),
    CANCELADO("CAN", "Pedido cancelado");

    private final String sigla;
    private final String descricao;

    StatusEntrega(String sigla, String descricao) {
        this.sigla = sigla;
        this.descricao = descricao;
    }

    /**
     * Busca o enum correspondente a partir de uma sigla.
     * @param sigla A sigla a ser buscada (ex: "EM")
     * @return O StatusEntrega correspondente ou null se não encontrado
     */
    public static StatusEntrega getBySigla(String sigla) {
        if (sigla == null) {
            return null;
        }

        for (StatusEntrega status : StatusEntrega.values()) {
            if (status.getSigla().equalsIgnoreCase(sigla)) {
                return status;
            }
        }

        return null; // Retorna null se a sigla não corresponder a nenhum status
    }
}
