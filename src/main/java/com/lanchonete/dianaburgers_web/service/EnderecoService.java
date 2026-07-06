package com.lanchonete.dianaburgers_web.service;

import com.lanchonete.dianaburgers_web.exception.*;
import com.lanchonete.dianaburgers_web.model.EnderecoModel;
import com.lanchonete.dianaburgers_web.repository.EnderecoRepository;
import com.lanchonete.dianaburgers_web.rest.dto.EnderecoDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public EnderecoDTO obterPorId(int id) {
        EnderecoModel endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Endereço com ID " + id + " não encontrado."));
        return modelMapper.map(endereco, EnderecoDTO.class);
    }

    @Transactional(readOnly = true)
    public List<EnderecoDTO> obterTodos() {
        return enderecoRepository.findAll()
                .stream()
                .map(e -> modelMapper.map(e, EnderecoDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public EnderecoDTO salvar(EnderecoModel novoEndereco) {
        if (enderecoRepository.existsByCepAndUsuario(novoEndereco.getCep(), novoEndereco.getUsuario())) {
            throw new ConstraintException("Já existe um endereço com o CEP '" + novoEndereco.getCep()
                    + "' cadastrado para este usuário!");
        }
        return modelMapper.map(enderecoRepository.save(novoEndereco), EnderecoDTO.class);
    }

    @Transactional
    public EnderecoDTO atualizar(EnderecoModel enderecoExistente) {
        if (!enderecoRepository.existsById(enderecoExistente.getIdEndereco())) {
            throw new ObjectNotFoundException("Endereço com ID " + enderecoExistente.getIdEndereco()
                    + " não encontrado na base de dados!");
        }
        return modelMapper.map(enderecoRepository.save(enderecoExistente), EnderecoDTO.class);
    }

    @Transactional
    public void deletar(int id) {
        EnderecoModel endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Endereço com ID " + id
                        + " não encontrado na base de dados!"));
        enderecoRepository.delete(endereco);
    }
}
