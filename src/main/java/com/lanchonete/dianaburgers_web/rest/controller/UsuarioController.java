package com.lanchonete.dianaburgers_web.rest.controller;

import com.lanchonete.dianaburgers_web.model.UsuarioModel;
import com.lanchonete.dianaburgers_web.rest.dto.LoginDTO;
import com.lanchonete.dianaburgers_web.rest.dto.UsuarioDTO;
import com.lanchonete.dianaburgers_web.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    /** POST /usuario/login */
    @PostMapping("/login")
    public ResponseEntity<UsuarioDTO> login(@RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(usuarioService.autenticar(loginDTO.getEmail(), loginDTO.getSenha()));
    }

    /** GET /usuario/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obterPorId(@PathVariable int id) {
        return ResponseEntity.ok(usuarioService.obterPorId(id));
    }

    /** GET /usuario */
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> obterTodos() {
        return ResponseEntity.ok(usuarioService.obterTodos());
    }

    /** POST /usuario */
    @PostMapping
    public ResponseEntity<UsuarioDTO> salvar(@Valid @RequestBody UsuarioModel novoUsuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.salvar(novoUsuario));
    }

    /** PUT /usuario */
    @PutMapping
    public ResponseEntity<UsuarioDTO> atualizar(@Valid @RequestBody UsuarioModel usuarioExistente) {
        return ResponseEntity.ok(usuarioService.atualizar(usuarioExistente));
    }

    /** DELETE /usuario/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
