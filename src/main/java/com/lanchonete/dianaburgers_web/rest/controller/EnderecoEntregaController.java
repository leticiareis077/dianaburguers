package com.lanchonete.dianaburgers_web.rest.controller;

import com.lanchonete.dianaburgers_web.model.EnderecoEntregaModel;
import com.lanchonete.dianaburgers_web.rest.dto.EnderecoEntregaDTO;
import com.lanchonete.dianaburgers_web.service.EnderecoEntregaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/endereco-entrega")
public class EnderecoEntregaController {

    @Autowired
    private EnderecoEntregaService enderecoEntregaService;

    @GetMapping("/{id}")
    public ResponseEntity<EnderecoEntregaDTO> obterPorId(@PathVariable int id) {
        return ResponseEntity.ok(enderecoEntregaService.obterPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<EnderecoEntregaDTO>> obterTodos() {
        return ResponseEntity.ok(enderecoEntregaService.obterTodos());
    }

    @PostMapping
    public ResponseEntity<EnderecoEntregaDTO> salvar(@Valid @RequestBody EnderecoEntregaModel novoEnderecoEntrega) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enderecoEntregaService.salvar(novoEnderecoEntrega));
    }

    @PutMapping
    public ResponseEntity<EnderecoEntregaDTO> atualizar(@Valid @RequestBody EnderecoEntregaModel enderecoEntregaExistente) {
        return ResponseEntity.ok(enderecoEntregaService.atualizar(enderecoEntregaExistente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        enderecoEntregaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
