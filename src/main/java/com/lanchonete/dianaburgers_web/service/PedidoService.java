package com.lanchonete.dianaburgers_web.service;

import com.lanchonete.dianaburgers_web.exception.*;
import com.lanchonete.dianaburgers_web.model.PedidoModel;
import com.lanchonete.dianaburgers_web.model.UsuarioModel;
import com.lanchonete.dianaburgers_web.repository.PedidoRepository;
import com.lanchonete.dianaburgers_web.repository.UsuarioRepository;
import com.lanchonete.dianaburgers_web.rest.dto.PedidoDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public PedidoDTO obterPorId(int id) {
        PedidoModel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Pedido com ID " + id + " não encontrado."));
        return toDTO(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoDTO> obterTodos() {
        return pedidoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PedidoDTO> obterPorUsuario(int idUsuario) {
        return pedidoRepository.findAll()
                .stream()
                .filter(p -> p.getUsuario() != null && p.getUsuario().getId() == idUsuario)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PedidoDTO salvar(PedidoModel novoPedido) {
        if (novoPedido.getValorTotal() == null || novoPedido.getValorTotal().signum() <= 0) {
            throw new BusinessRuleException("O valor total do pedido deve ser maior que zero!");
        }
        vincularUsuario(novoPedido);
        return toDTO(pedidoRepository.save(novoPedido));
    }

    @Transactional
    public PedidoDTO atualizar(PedidoModel pedidoExistente) {
        if (!pedidoRepository.existsById(pedidoExistente.getIdPedido())) {
            throw new ObjectNotFoundException("Pedido com ID " + pedidoExistente.getIdPedido()
                    + " não encontrado na base de dados!");
        }
        vincularUsuario(pedidoExistente);
        return toDTO(pedidoRepository.save(pedidoExistente));
    }

    @Transactional
    public void deletar(int id) {
        PedidoModel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Pedido com ID " + id + " não encontrado na base de dados!"));
        pedidoRepository.delete(pedido);
    }

    @Transactional
    public PedidoDTO atualizarStatus(int id, String status) {
        if (status == null || status.isBlank()) {
            throw new BusinessRuleException("O status não pode ser vazio.");
        }
        PedidoModel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Pedido com ID " + id + " não encontrado."));
        pedido.setStatus(status);
        return toDTO(pedidoRepository.save(pedido));
    }

    /** Garante que o usuário do pedido seja uma entidade gerenciada (evita erro de entidade transiente). */
    private void vincularUsuario(PedidoModel pedido) {
        if (pedido.getUsuario() == null || pedido.getUsuario().getId() <= 0) {
            throw new BusinessRuleException("O pedido precisa estar associado a um usuário.");
        }
        UsuarioModel usuario = usuarioRepository.findById(pedido.getUsuario().getId())
                .orElseThrow(() -> new ObjectNotFoundException(
                        "Usuário com ID " + pedido.getUsuario().getId() + " não encontrado."));
        pedido.setUsuario(usuario);
    }

    private PedidoDTO toDTO(PedidoModel pedido) {
        PedidoDTO dto = modelMapper.map(pedido, PedidoDTO.class);
        if (pedido.getUsuario() != null) {
            dto.setIdUsuario(pedido.getUsuario().getId());
            dto.setNomeUsuario(pedido.getUsuario().getNome());
            dto.setTelefoneUsuario(pedido.getUsuario().getTelefone());
        }
        return dto;
    }
}
