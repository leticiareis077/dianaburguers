package com.lanchonete.dianaburgers_web.service;

import com.lanchonete.dianaburgers_web.exception.*;
import com.lanchonete.dianaburgers_web.model.ItensModel;
import com.lanchonete.dianaburgers_web.model.PedidoModel;
import com.lanchonete.dianaburgers_web.model.ProdutoModel;
import com.lanchonete.dianaburgers_web.repository.ItensRepository;
import com.lanchonete.dianaburgers_web.repository.PedidoRepository;
import com.lanchonete.dianaburgers_web.repository.ProdutoRepository;
import com.lanchonete.dianaburgers_web.rest.dto.ItensDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItensService {

    @Autowired
    private ItensRepository itensRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public ItensDTO obterPorId(int id) {
        ItensModel item = itensRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Item com ID " + id + " não encontrado."));
        return toDTO(item);
    }

    @Transactional(readOnly = true)
    public List<ItensDTO> obterTodos() {
        return itensRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ItensDTO> obterPorPedido(int idPedido) {
        return itensRepository.findAll()
                .stream()
                .filter(i -> i.getPedido() != null && i.getPedido().getIdPedido() == idPedido)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ItensDTO salvar(ItensModel novoItem) {
        if (novoItem.getQuantidade() < 1) {
            throw new BusinessRuleException("A quantidade do item deve ser no mínimo 1!");
        }
        if (novoItem.getPrecoUnit() == null || novoItem.getPrecoUnit().signum() <= 0) {
            throw new BusinessRuleException("O preço unitário do item deve ser maior que zero!");
        }
        vincularReferencias(novoItem);
        return toDTO(itensRepository.save(novoItem));
    }

    @Transactional
    public ItensDTO atualizar(ItensModel itemExistente) {
        if (!itensRepository.existsById(itemExistente.getIdItem())) {
            throw new ObjectNotFoundException("Item com ID " + itemExistente.getIdItem()
                    + " não encontrado na base de dados!");
        }
        vincularReferencias(itemExistente);
        return toDTO(itensRepository.save(itemExistente));
    }

    @Transactional
    public void deletar(int id) {
        ItensModel item = itensRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Item com ID " + id + " não encontrado na base de dados!"));
        itensRepository.delete(item);
    }

    /** Garante que pedido e produto do item sejam entidades gerenciadas (evita erro de entidade transiente). */
    private void vincularReferencias(ItensModel item) {
        if (item.getPedido() == null || item.getPedido().getIdPedido() <= 0) {
            throw new BusinessRuleException("O item precisa estar associado a um pedido.");
        }
        if (item.getProduto() == null || item.getProduto().getIdProduto() <= 0) {
            throw new BusinessRuleException("O item precisa estar associado a um produto.");
        }
        PedidoModel pedido = pedidoRepository.findById(item.getPedido().getIdPedido())
                .orElseThrow(() -> new ObjectNotFoundException(
                        "Pedido com ID " + item.getPedido().getIdPedido() + " não encontrado."));
        ProdutoModel produto = produtoRepository.findById(item.getProduto().getIdProduto())
                .orElseThrow(() -> new ObjectNotFoundException(
                        "Produto com ID " + item.getProduto().getIdProduto() + " não encontrado."));
        item.setPedido(pedido);
        item.setProduto(produto);
    }

    private ItensDTO toDTO(ItensModel item) {
        ItensDTO dto = modelMapper.map(item, ItensDTO.class);
        if (item.getPedido() != null) {
            dto.setIdPedido(item.getPedido().getIdPedido());
        }
        if (item.getProduto() != null) {
            dto.setIdProduto(item.getProduto().getIdProduto());
            dto.setNomeProduto(item.getProduto().getNome());
        }
        return dto;
    }
}
