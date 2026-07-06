package com.lanchonete.dianaburgers_web.service;

import com.lanchonete.dianaburgers_web.exception.*;
import com.lanchonete.dianaburgers_web.model.CategoriaModel;
import com.lanchonete.dianaburgers_web.model.ProdutoModel;
import com.lanchonete.dianaburgers_web.repository.CategoriaRepository;
import com.lanchonete.dianaburgers_web.repository.ProdutoRepository;
import com.lanchonete.dianaburgers_web.rest.dto.ProdutoDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public ProdutoDTO obterPorId(int id) {
        ProdutoModel produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Produto com ID " + id + " não encontrado."));
        return toDTO(produto);
    }

    @Transactional(readOnly = true)
    public List<ProdutoDTO> obterTodos() {
        return produtoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProdutoDTO salvar(ProdutoModel novoProduto) {
        if (produtoRepository.existsByNome(novoProduto.getNome())) {
            throw new ConstraintException("Já existe um produto com o nome '"
                    + novoProduto.getNome() + "' na base de dados!");
        }
        vincularCategoria(novoProduto);
        return toDTO(produtoRepository.save(novoProduto));
    }

    @Transactional
    public ProdutoDTO atualizar(ProdutoModel produtoExistente) {
        if (!produtoRepository.existsById(produtoExistente.getIdProduto())) {
            throw new ObjectNotFoundException("Produto com ID " + produtoExistente.getIdProduto()
                    + " não encontrado na base de dados!");
        }
        vincularCategoria(produtoExistente);
        return toDTO(produtoRepository.save(produtoExistente));
    }

    /**
     * Garante que a categoria informada (só com o ID preenchido) seja
     * substituída pela entidade gerenciada correspondente antes de salvar,
     * evitando erro de entidade "transiente" no JPA.
     */
    private void vincularCategoria(ProdutoModel produto) {
        if (produto.getCategoria() != null && produto.getCategoria().getIdCategoria() > 0) {
            CategoriaModel categoria = categoriaRepository.findById(produto.getCategoria().getIdCategoria())
                    .orElseThrow(() -> new ObjectNotFoundException(
                            "Categoria com ID " + produto.getCategoria().getIdCategoria() + " não encontrada."));
            produto.setCategoria(categoria);
        } else {
            produto.setCategoria(null);
        }
    }

    private ProdutoDTO toDTO(ProdutoModel produto) {
        ProdutoDTO dto = modelMapper.map(produto, ProdutoDTO.class);
        if (produto.getCategoria() != null) {
            dto.setIdCategoria(produto.getCategoria().getIdCategoria());
            dto.setNomeCategoria(produto.getCategoria().getNome());
        }
        return dto;
    }

    @Transactional
    public void deletar(int id) {
        ProdutoModel produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Produto com ID " + id
                        + " não encontrado na base de dados!"));
        produtoRepository.delete(produto);
    }
}
