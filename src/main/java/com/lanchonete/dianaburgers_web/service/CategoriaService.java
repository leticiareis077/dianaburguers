package com.lanchonete.dianaburgers_web.service;

import com.lanchonete.dianaburgers_web.exception.*;
import com.lanchonete.dianaburgers_web.model.CategoriaModel;
import com.lanchonete.dianaburgers_web.repository.CategoriaRepository;
import com.lanchonete.dianaburgers_web.rest.dto.CategoriaDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public CategoriaDTO obterPorId(int id) {
        CategoriaModel categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Categoria com ID " + id + " não encontrada."));
        return modelMapper.map(categoria, CategoriaDTO.class);
    }

    @Transactional(readOnly = true)
    public List<CategoriaDTO> obterTodos() {
        return categoriaRepository.findAll()
                .stream()
                .map(c -> modelMapper.map(c, CategoriaDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoriaDTO salvar(CategoriaModel novaCategoria) {
        if (categoriaRepository.existsByNome(novaCategoria.getNome())) {
            throw new ConstraintException("Já existe uma categoria com o nome '" + novaCategoria.getNome() + "'!");
        }
        return modelMapper.map(categoriaRepository.save(novaCategoria), CategoriaDTO.class);
    }

    @Transactional
    public CategoriaDTO atualizar(CategoriaModel categoriaExistente) {
        if (!categoriaRepository.existsById(categoriaExistente.getIdCategoria())) {
            throw new ObjectNotFoundException("Categoria com ID " + categoriaExistente.getIdCategoria() + " não encontrada na base de dados!");
        }
        return modelMapper.map(categoriaRepository.save(categoriaExistente), CategoriaDTO.class);
    }

    @Transactional
    public void deletar(int id) {
        CategoriaModel categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Categoria com ID " + id + " não encontrada na base de dados!"));
        categoriaRepository.delete(categoria);
    }
}
