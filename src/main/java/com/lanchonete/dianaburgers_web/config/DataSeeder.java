package com.lanchonete.dianaburgers_web.config;

import com.lanchonete.dianaburgers_web.model.CategoriaModel;
import com.lanchonete.dianaburgers_web.model.ProdutoModel;
import com.lanchonete.dianaburgers_web.model.UsuarioModel;
import com.lanchonete.dianaburgers_web.repository.CategoriaRepository;
import com.lanchonete.dianaburgers_web.repository.ProdutoRepository;
import com.lanchonete.dianaburgers_web.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Popula o banco Postgres com os dados iniciais (usuários, categorias e produtos)
 * apenas na primeira vez, já que o data.sql padrão só roda para o perfil H2.
 * Usa IDs gerados automaticamente (IDENTITY) em vez de IDs fixos, para não
 * colidir com registros criados depois pelo uso normal da aplicação.
 */
@Component
@Profile("postgres")
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Override
    public void run(String... args) {
        seedUsuarios();
        Map<String, CategoriaModel> categorias = seedCategorias();
        seedProdutos(categorias);
    }

    private void seedUsuarios() {
        if (usuarioRepository.count() > 0) {
            return;
        }
        UsuarioModel admin = new UsuarioModel();
        admin.setNome("Admin");
        admin.setEmail("admin@dianaburgers.com");
        admin.setSenhaUsuario("65536:8Q4XfCbrDoPqxcJrZu6ULw==:LprT1r5omrv//70ri790W5eFS97dzJ/FLKRPvbmoYy0=");
        admin.setCpf("00000000000");
        admin.setTelefone("79999990000");
        admin.setRole("admin");
        usuarioRepository.save(admin);

        UsuarioModel funcionario = new UsuarioModel();
        funcionario.setNome("Carlos Silva");
        funcionario.setEmail("func@dianaburgers.com");
        funcionario.setSenhaUsuario("65536:jSwSAmdX3w+OBKnyNoVvSA==:YHiE/NyJo8+Ahzr7rmlfpl1gTGJM/0qYj+EUssqWaFQ=");
        funcionario.setCpf("11111111111");
        funcionario.setTelefone("79999990001");
        funcionario.setRole("funcionario");
        usuarioRepository.save(funcionario);
    }

    private Map<String, CategoriaModel> seedCategorias() {
        Map<String, CategoriaModel> mapa = new HashMap<>();
        if (categoriaRepository.count() > 0) {
            categoriaRepository.findAll().forEach(c -> mapa.put(c.getNome(), c));
            return mapa;
        }
        for (String nome : List.of("Hambúrgueres", "Batata Frita", "Bebidas", "Sobremesas")) {
            CategoriaModel categoria = new CategoriaModel();
            categoria.setNome(nome);
            mapa.put(nome, categoriaRepository.save(categoria));
        }
        return mapa;
    }

    private void seedProdutos(Map<String, CategoriaModel> categorias) {
        if (produtoRepository.count() > 0) {
            return;
        }
        CategoriaModel hamburgueres = categorias.get("Hambúrgueres");
        CategoriaModel batataFrita = categorias.get("Batata Frita");
        CategoriaModel bebidas = categorias.get("Bebidas");

        // Hambúrgueres / Bacon
        salvarProduto("X-Bacon", "19.00", "Bacon crocante, cheddar e molho especial", hamburgueres, "Bacon", "7.5", "🍔");
        salvarProduto("Artesanal Bacon", "28.00", "Blend 180g, bacon, rúcula e geleia de pimenta", hamburgueres, "Bacon", "11.0", "🍔");
        salvarProduto("Bacon Duplo", "33.00", "Duplo blend com bacon e cheddar gratinado", hamburgueres, "Bacon", "13.0", "🍔");
        salvarProduto("Bacon Crispy", "24.00", "Bacon fatiado extra com picles e mostarda", hamburgueres, "Bacon", "9.5", "🍔");
        salvarProduto("Bacon Smash", "26.00", "Smash burguer com bacon e queijo americano", hamburgueres, "Bacon", "10.0", "🍔");

        // Hambúrgueres / Frango
        salvarProduto("X-Frango", "17.00", "Peito grelhado, alface e tomate", hamburgueres, "Frango", "6.0", "🍗");
        salvarProduto("Frango Cheddar", "21.00", "Frango crocante com cheddar cremoso", hamburgueres, "Frango", "8.0", "🍗");
        salvarProduto("Frango Barbecue", "23.00", "Frango grelhado com molho barbecue defumado", hamburgueres, "Frango", "8.5", "🍗");
        salvarProduto("Frango Parmegiana", "25.00", "Frango empanado com molho de tomate e mussarela", hamburgueres, "Frango", "9.5", "🍗");
        salvarProduto("Frango Catupiry", "24.00", "Frango desfiado com catupiry e orégano", hamburgueres, "Frango", "9.0", "🍗");

        // Hambúrgueres / Calabresa
        salvarProduto("X-Calabresa", "20.00", "Calabresa artesanal, cebola caramelizada e queijo", hamburgueres, "Calabresa", "7.0", "🍔");
        salvarProduto("Calabresa Defumada", "24.00", "Linguiça defumada, pimentão e molho da casa", hamburgueres, "Calabresa", "9.0", "🍔");
        salvarProduto("Calabresa Smash", "27.00", "Blend de calabresa smash com queijo e cebola roxa", hamburgueres, "Calabresa", "10.5", "🍔");
        salvarProduto("Calabresa + Ovo", "22.00", "Calabresa fatiada com ovo frito e catupiry", hamburgueres, "Calabresa", "8.0", "🍔");
        salvarProduto("Duplo Calabresa", "30.00", "Dois blends de calabresa com queijo e picles", hamburgueres, "Calabresa", "12.0", "🍔");

        // Hambúrgueres / Clássicos
        salvarProduto("X-Burger", "12.00", "Pão brioche, blend 150g, alface e tomate", hamburgueres, "Clássicos", "5.0", "🍔");
        salvarProduto("X-Egg", "15.00", "Com ovo frito e queijo prato", hamburgueres, "Clássicos", "6.0", "🍔");
        salvarProduto("Artesanal Cheddar", "26.00", "Blend 180g, cheddar duplo e picles artesanal", hamburgueres, "Clássicos", "10.0", "🍔");
        salvarProduto("Artesanal Duplo", "32.00", "Dois blends 180g, queijo e molho da casa", hamburgueres, "Clássicos", "13.0", "🍔");
        salvarProduto("Veggie Burger", "22.00", "Blend de legumes, queijo vegano e alface", hamburgueres, "Clássicos", "7.0", "🥗");

        // Batata Frita
        salvarProduto("Batata Simples", "14.00", "Batata palito crocante com sal e tempero da casa", batataFrita, "Tradicionais", "4.0", "🍟");
        salvarProduto("Batata Cheddar", "18.00", "Batata palito com cheddar cremoso derretido", batataFrita, "Tradicionais", "5.5", "🍟");
        salvarProduto("Batata Bacon", "20.00", "Batata crocante com bacon em pedaços e cheddar", batataFrita, "Tradicionais", "6.5", "🍟");
        salvarProduto("Batata Frango", "22.00", "Batata com frango desfiado temperado e catupiry", batataFrita, "Tradicionais", "7.0", "🍟");
        salvarProduto("Batata Diana", "26.00", "Batata com blend de carnes, cheddar e molho especial", batataFrita, "Especiais", "8.5", "🍟");
        salvarProduto("Batata Calabresa", "24.00", "Batata com calabresa artesanal, pimentão e cebola", batataFrita, "Especiais", "7.5", "🍟");
        salvarProduto("Batata Veggie", "19.00", "Batata com legumes grelhados e molho pesto", batataFrita, "Especiais", "5.5", "🍟");

        // Bebidas
        salvarProduto("Coca-Cola", "8.00", "Lata 350ml geladinha", bebidas, "Geladas", "3.5", "🥤");
        salvarProduto("Guaraná Antarctica", "7.00", "Lata 350ml geladinha", bebidas, "Geladas", "3.0", "🥤");
        salvarProduto("Água s/ Gás", "4.00", "500ml", bebidas, "Geladas", "1.5", "💧");
        salvarProduto("Cerveja", "9.00", "Long neck 355ml", bebidas, "Geladas", "4.0", "🍺");
        salvarProduto("Suco de Laranja", "9.00", "Natural, feito na hora 500ml", bebidas, "Naturais", "3.5", "🍊");
        salvarProduto("Suco de Morango", "10.00", "Natural com morango fresco 500ml", bebidas, "Naturais", "4.0", "🍓");
        salvarProduto("Vitamina de Banana", "10.00", "Com leite e mel 400ml", bebidas, "Naturais", "3.8", "🍌");
    }

    private void salvarProduto(String nome, String preco, String descricao, CategoriaModel categoria,
                                String subcategoria, String custo, String emoji) {
        ProdutoModel produto = new ProdutoModel();
        produto.setNome(nome);
        produto.setPreco(new BigDecimal(preco));
        produto.setDescricao(descricao);
        produto.setDisponivel(true);
        produto.setCategoria(categoria);
        produto.setSubcategoria(subcategoria);
        produto.setCusto(new BigDecimal(custo));
        produto.setEmoji(emoji);
        produtoRepository.save(produto);
    }
}
