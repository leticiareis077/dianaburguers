package com.lanchonete.dianaburgers_web.rest.controller;

import com.lanchonete.dianaburgers_web.model.ItensModel;
import com.lanchonete.dianaburgers_web.rest.dto.ItensDTO;
import com.lanchonete.dianaburgers_web.service.ItensService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/itens")
public class ItensController {

    @Autowired
    private ItensService itensService;

    @GetMapping("/{id}")
    public ResponseEntity<ItensDTO> obterPorId(@PathVariable int id) {
        return ResponseEntity.ok(itensService.obterPorId(id));
    }

    /** GET /itens           -> todos os itens
     *  GET /itens?idPedido= -> só os itens daquele pedido */
    @GetMapping
    public ResponseEntity<List<ItensDTO>> obterTodos(@RequestParam(required = false) Integer idPedido) {
        if (idPedido != null) {
            return ResponseEntity.ok(itensService.obterPorPedido(idPedido));
        }
        return ResponseEntity.ok(itensService.obterTodos());
    }

    @PostMapping
    public ResponseEntity<ItensDTO> salvar(@Valid @RequestBody ItensModel novoItem) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itensService.salvar(novoItem));
    }

    @PutMapping
    public ResponseEntity<ItensDTO> atualizar(@Valid @RequestBody ItensModel itemExistente) {
        return ResponseEntity.ok(itensService.atualizar(itemExistente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        itensService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
