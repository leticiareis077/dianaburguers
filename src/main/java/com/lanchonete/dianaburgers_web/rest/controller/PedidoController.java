package com.lanchonete.dianaburgers_web.rest.controller;

import com.lanchonete.dianaburgers_web.model.PedidoModel;
import com.lanchonete.dianaburgers_web.rest.dto.PedidoDTO;
import com.lanchonete.dianaburgers_web.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/pedido")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> obterPorId(@PathVariable int id) {
        return ResponseEntity.ok(pedidoService.obterPorId(id));
    }

    /** GET /pedido            -> todos os pedidos
     *  GET /pedido?idUsuario= -> só os pedidos daquele usuário (usado em "Minha Conta") */
    @GetMapping
    public ResponseEntity<List<PedidoDTO>> obterTodos(@RequestParam(required = false) Integer idUsuario) {
        if (idUsuario != null) {
            return ResponseEntity.ok(pedidoService.obterPorUsuario(idUsuario));
        }
        return ResponseEntity.ok(pedidoService.obterTodos());
    }

    @PostMapping
    public ResponseEntity<PedidoDTO> salvar(@Valid @RequestBody PedidoModel novoPedido) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.salvar(novoPedido));
    }

    @PutMapping
    public ResponseEntity<PedidoDTO> atualizar(@Valid @RequestBody PedidoModel pedidoExistente) {
        return ResponseEntity.ok(pedidoService.atualizar(pedidoExistente));
    }

    /** PATCH /pedido/{id}/status  body: {"status": "entregue"} */
    @PatchMapping("/{id}/status")
    public ResponseEntity<PedidoDTO> atualizarStatus(@PathVariable int id, @RequestBody java.util.Map<String, String> body) {
        return ResponseEntity.ok(pedidoService.atualizarStatus(id, body.get("status")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        pedidoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
