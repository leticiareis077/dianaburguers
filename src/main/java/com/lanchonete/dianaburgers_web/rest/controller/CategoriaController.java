package com.lanchonete.dianaburgers_web.rest.controller;

import com.lanchonete.dianaburgers_web.model.CategoriaModel;
import com.lanchonete.dianaburgers_web.rest.dto.CategoriaDTO;
import com.lanchonete.dianaburgers_web.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categoria")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> obterPorId(@PathVariable int id) {
        return ResponseEntity.ok(categoriaService.obterPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> obterTodos() {
        return ResponseEntity.ok(categoriaService.obterTodos());
    }

    @PostMapping
    public ResponseEntity<CategoriaDTO> salvar(@Valid @RequestBody CategoriaModel novaCategoria) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.salvar(novaCategoria));
    }

    @PutMapping
    public ResponseEntity<CategoriaDTO> atualizar(@Valid @RequestBody CategoriaModel categoriaExistente) {
        return ResponseEntity.ok(categoriaService.atualizar(categoriaExistente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        categoriaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
