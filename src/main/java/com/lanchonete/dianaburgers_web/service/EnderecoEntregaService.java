package com.lanchonete.dianaburgers_web.service;

import com.lanchonete.dianaburgers_web.exception.*;
import com.lanchonete.dianaburgers_web.model.EnderecoEntregaModel;
import com.lanchonete.dianaburgers_web.repository.EnderecoEntregaRepository;
import com.lanchonete.dianaburgers_web.rest.dto.EnderecoEntregaDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnderecoEntregaService {

    @Autowired
    private EnderecoEntregaRepository enderecoEntregaRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public EnderecoEntregaDTO obterPorId(int id) {
        EnderecoEntregaModel entrega = enderecoEntregaRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Endereço de entrega com ID " + id + " não encontrado."));
        return modelMapper.map(entrega, EnderecoEntregaDTO.class);
    }

    @Transactional(readOnly = true)
    public List<EnderecoEntregaDTO> obterTodos() {
        return enderecoEntregaRepository.findAll()
                .stream()
                .map(e -> modelMapper.map(e, EnderecoEntregaDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public EnderecoEntregaDTO salvar(EnderecoEntregaModel novoEnderecoEntrega) {
        if (enderecoEntregaRepository.existsByPedido(novoEnderecoEntrega.getPedido())) {
            throw new ConstraintException("Este pedido já possui um endereço de entrega cadastrado!");
        }
        return modelMapper.map(enderecoEntregaRepository.save(novoEnderecoEntrega), EnderecoEntregaDTO.class);
    }

    @Transactional
    public EnderecoEntregaDTO atualizar(EnderecoEntregaModel enderecoEntregaExistente) {
        if (!enderecoEntregaRepository.existsById(enderecoEntregaExistente.getIdEntrega())) {
            throw new ObjectNotFoundException("Endereço de entrega com ID " + enderecoEntregaExistente.getIdEntrega()
                    + " não encontrado na base de dados!");
        }
        return modelMapper.map(enderecoEntregaRepository.save(enderecoEntregaExistente), EnderecoEntregaDTO.class);
    }

    @Transactional
    public void deletar(int id) {
        EnderecoEntregaModel entrega = enderecoEntregaRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Endereço de entrega com ID " + id
                        + " não encontrado na base de dados!"));
        enderecoEntregaRepository.delete(entrega);
    }
}
