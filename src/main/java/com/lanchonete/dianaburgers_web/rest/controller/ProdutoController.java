package com.lanchonete.dianaburgers_web.rest.controller;

import com.lanchonete.dianaburgers_web.model.ProdutoModel;
import com.lanchonete.dianaburgers_web.rest.dto.ProdutoDTO;
import com.lanchonete.dianaburgers_web.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/produto")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    /** GET /produto/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> obterPorId(@PathVariable int id) {
        return ResponseEntity.ok(produtoService.obterPorId(id));
    }

    /** GET /produto */
    @GetMapping
    public ResponseEntity<List<ProdutoDTO>> obterTodos() {
        return ResponseEntity.ok(produtoService.obterTodos());
    }

    /** POST /produto */
    @PostMapping
    public ResponseEntity<ProdutoDTO> salvar(@Valid @RequestBody ProdutoModel novoProduto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoService.salvar(novoProduto));
    }

    /** PUT /produto */
    @PutMapping
    public ResponseEntity<ProdutoDTO> atualizar(@Valid @RequestBody ProdutoModel produtoExistente) {
        return ResponseEntity.ok(produtoService.atualizar(produtoExistente));
    }

    /** DELETE /produto/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
