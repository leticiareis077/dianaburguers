package com.lanchonete.dianaburgers_web.rest.controller;

import com.lanchonete.dianaburgers_web.model.EnderecoModel;
import com.lanchonete.dianaburgers_web.rest.dto.EnderecoDTO;
import com.lanchonete.dianaburgers_web.service.EnderecoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/endereco")
public class EnderecoController {

    @Autowired
    private EnderecoService enderecoService;

    @GetMapping("/{id}")
    public ResponseEntity<EnderecoDTO> obterPorId(@PathVariable int id) {
        return ResponseEntity.ok(enderecoService.obterPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<EnderecoDTO>> obterTodos() {
        return ResponseEntity.ok(enderecoService.obterTodos());
    }

    @PostMapping
    public ResponseEntity<EnderecoDTO> salvar(@Valid @RequestBody EnderecoModel novoEndereco) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enderecoService.salvar(novoEndereco));
    }

    @PutMapping
    public ResponseEntity<EnderecoDTO> atualizar(@Valid @RequestBody EnderecoModel enderecoExistente) {
        return ResponseEntity.ok(enderecoService.atualizar(enderecoExistente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        enderecoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
