package com.lanchonete.dianaburgers_web.service;

import com.lanchonete.dianaburgers_web.exception.*;
import com.lanchonete.dianaburgers_web.model.UsuarioModel;
import com.lanchonete.dianaburgers_web.repository.UsuarioRepository;
import com.lanchonete.dianaburgers_web.rest.dto.UsuarioDTO;
import com.lanchonete.dianaburgers_web.util.PasswordUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    /**
     * Repositório de usuários: acesso ao banco de dados.
     */
    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * ModelMapper gerenciado como Bean (singleton).
     */
    @Autowired
    private ModelMapper modelMapper;

    /**
     * Obtém um usuário pelo ID.
     *
     * @param id ID do usuário.
     * @return UsuarioDTO com os dados do usuário encontrado.
     * @throws ObjectNotFoundException Se o usuário não for encontrado.
     */
    @Transactional(readOnly = true)
    public UsuarioDTO obterPorId(int id) {
        UsuarioModel usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Usuário com ID " + id + " não encontrado."));

        return toDTO(usuario);
    }

    /**
     * Retorna todos os usuários cadastrados.
     *
     * @return Lista de UsuarioDTO.
     */
    @Transactional(readOnly = true)
    public List<UsuarioDTO> obterTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Autentica um usuário por e-mail e senha.
     *
     * @param email e-mail informado no login.
     * @param senha senha em texto puro informada no login.
     * @return UsuarioDTO do usuário autenticado (sem a senha).
     * @throws AuthenticationException Se e-mail ou senha estiverem incorretos.
     */
    @Transactional(readOnly = true)
    public UsuarioDTO autenticar(String email, String senha) {
        UsuarioModel usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("E-mail ou senha inválidos."));

        if (!PasswordUtil.matches(senha, usuario.getSenhaUsuario())) {
            throw new AuthenticationException("E-mail ou senha inválidos.");
        }

        return toDTO(usuario);
    }

    /**
     * Salva um novo usuário na base de dados.
     *
     * @param novoUsuario Dados do novo usuário.
     * @return UsuarioDTO do usuário salvo.
     * @throws ConstraintException    Se e-mail, CPF ou telefone já estiverem cadastrados.
     * @throws DataIntegrityException Se ocorrer violação de integridade.
     * @throws BusinessRuleException  Se houver violação de regra de negócio.
     * @throws SQLException           Se ocorrer falha de conexão com o banco.
     */
    @Transactional
    public UsuarioDTO salvar(UsuarioModel novoUsuario) {
        try {
            if (usuarioRepository.existsByEmail(novoUsuario.getEmail())) {
                throw new ConstraintException("Já existe um usuário com o e-mail '"
                        + novoUsuario.getEmail() + "' na base de dados!");
            }
            if (usuarioRepository.existsByCpf(novoUsuario.getCpf())) {
                throw new ConstraintException("Já existe um usuário com o CPF '"
                        + novoUsuario.getCpf() + "' na base de dados!");
            }
            if (usuarioRepository.existsByTelefone(novoUsuario.getTelefone())) {
                throw new ConstraintException("Já existe um usuário com o telefone '"
                        + novoUsuario.getTelefone() + "' na base de dados!");
            }

            if (novoUsuario.getRole() == null || novoUsuario.getRole().isBlank()) {
                novoUsuario.setRole("cliente");
            }
            novoUsuario.setSenhaUsuario(PasswordUtil.hash(novoUsuario.getSenhaUsuario()));

            return toDTO(usuarioRepository.save(novoUsuario));

        } catch (ConstraintException e) {
            throw e;
        } catch (DataIntegrityException e) {
            throw new DataIntegrityException("Erro! Não foi possível salvar o usuário " + novoUsuario.getNome() + "!");
        } catch (BusinessRuleException e) {
            throw new BusinessRuleException("Erro! Violação de regra de negócio ao salvar o usuário " + novoUsuario.getNome() + "!");
        } catch (DatabaseException e) {
            throw new DatabaseException("Erro! Falha na conexão com o banco ao salvar o usuário " + novoUsuario.getNome() + "!");
        }
    }

    /**
     * Atualiza os dados de um usuário existente.
     *
     * @param usuarioExistente Dados atualizados do usuário.
     * @return UsuarioDTO com os dados atualizados.
     * @throws ObjectNotFoundException Se o usuário não existir.
     * @throws DataIntegrityException  Se ocorrer violação de integridade.
     * @throws BusinessRuleException   Se houver violação de regra de negócio.
     * @throws SQLException            Se ocorrer falha de conexão com o banco.
     */
    @Transactional
    public UsuarioDTO atualizar(UsuarioModel usuarioExistente) {
        try {
            UsuarioModel usuarioAtual = usuarioRepository.findById(usuarioExistente.getId())
                    .orElseThrow(() -> new ObjectNotFoundException("Usuário com ID " + usuarioExistente.getId()
                            + " não encontrado na base de dados!"));

            // Se a senha não foi reenviada (ou veio igual ao hash já salvo), mantém o hash atual.
            if (usuarioExistente.getSenhaUsuario() == null || usuarioExistente.getSenhaUsuario().isBlank()) {
                usuarioExistente.setSenhaUsuario(usuarioAtual.getSenhaUsuario());
            } else if (!usuarioExistente.getSenhaUsuario().equals(usuarioAtual.getSenhaUsuario())) {
                usuarioExistente.setSenhaUsuario(PasswordUtil.hash(usuarioExistente.getSenhaUsuario()));
            }
            if (usuarioExistente.getRole() == null || usuarioExistente.getRole().isBlank()) {
                usuarioExistente.setRole(usuarioAtual.getRole());
            }

            return toDTO(usuarioRepository.save(usuarioExistente));

        } catch (ObjectNotFoundException e) {
            throw e;
        } catch (DataIntegrityException e) {
            throw new DataIntegrityException("Erro! Não foi possível atualizar o usuário " + usuarioExistente.getNome() + "!");
        } catch (BusinessRuleException e) {
            throw new BusinessRuleException("Erro! Violação de regra de negócio ao atualizar o usuário " + usuarioExistente.getNome() + "!");
        } catch (DatabaseException e) {
            throw new DatabaseException("Erro! Falha na conexão com o banco ao atualizar o usuário " + usuarioExistente.getNome() + "!");
        }
    }

    /**
     * Deleta um usuário da base de dados.
     *
     * @param id ID do usuário a ser deletado.
     * @throws ObjectNotFoundException Se o usuário não existir.
     * @throws DataIntegrityException  Se ocorrer violação de integridade.
     * @throws SQLException            Se ocorrer falha de conexão com o banco.
     */
    @Transactional
    public void deletar(int id) {
        try {
            UsuarioModel usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new ObjectNotFoundException("Usuário com ID " + id + " não encontrado na base de dados!"));

            usuarioRepository.delete(usuario);

        } catch (ObjectNotFoundException e) {
            throw e;
        } catch (DataIntegrityException e) {
            throw new DataIntegrityException("Erro! Não foi possível deletar o usuário com ID " + id + "!");
        } catch (DatabaseException e) {
            throw new DatabaseException("Erro! Falha na conexão com o banco ao deletar o usuário com ID " + id + "!");
        }
    }

    /**
     * Converte a entidade para DTO sem nunca expor o hash da senha para fora da API.
     */
    private UsuarioDTO toDTO(UsuarioModel usuario) {
        UsuarioDTO dto = modelMapper.map(usuario, UsuarioDTO.class);
        dto.setSenhaUsuario(null);
        return dto;
    }
}
