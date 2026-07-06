-- Usuários (senhas: admin123 e func123, já em hash PBKDF2 — nunca texto puro)
INSERT INTO usuario (id, nome, email, senha_usuario, cpf, telefone, role) VALUES
  (1, 'Admin',        'admin@dianaburgers.com', '65536:8Q4XfCbrDoPqxcJrZu6ULw==:LprT1r5omrv//70ri790W5eFS97dzJ/FLKRPvbmoYy0=', '00000000000', '79999990000', 'admin');
INSERT INTO usuario (id, nome, email, senha_usuario, cpf, telefone, role) VALUES
  (2, 'Carlos Silva',  'func@dianaburgers.com',  '65536:jSwSAmdX3w+OBKnyNoVvSA==:YHiE/NyJo8+Ahzr7rmlfpl1gTGJM/0qYj+EUssqWaFQ=', '11111111111', '79999990001', 'funcionario');

-- Sem isso, o próximo INSERT automático (cadastro de cliente) tentaria reusar o ID 1
ALTER TABLE usuario ALTER COLUMN id RESTART WITH 3;

-- Categorias
INSERT INTO categoria (id_categoria, nome) VALUES (1, 'Hambúrgueres');
INSERT INTO categoria (id_categoria, nome) VALUES (2, 'Batata Frita');
INSERT INTO categoria (id_categoria, nome) VALUES (3, 'Bebidas');
INSERT INTO categoria (id_categoria, nome) VALUES (4, 'Sobremesas');

-- Produtos — Hambúrgueres / Bacon
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (1,  'X-Bacon',            19.00, 'Bacon crocante, cheddar e molho especial',        true, 1, 'Bacon', 7.5, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (2,  'Artesanal Bacon',    28.00, 'Blend 180g, bacon, rúcula e geleia de pimenta',    true, 1, 'Bacon', 11.0, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (3,  'Bacon Duplo',        33.00, 'Duplo blend com bacon e cheddar gratinado',        true, 1, 'Bacon', 13.0, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (4,  'Bacon Crispy',       24.00, 'Bacon fatiado extra com picles e mostarda',        true, 1, 'Bacon', 9.5, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (5,  'Bacon Smash',        26.00, 'Smash burguer com bacon e queijo americano',       true, 1, 'Bacon', 10.0, '🍔');

-- Produtos — Hambúrgueres / Frango
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (6,  'X-Frango',           17.00, 'Peito grelhado, alface e tomate',                  true, 1, 'Frango', 6.0, '🍗');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (7,  'Frango Cheddar',     21.00, 'Frango crocante com cheddar cremoso',              true, 1, 'Frango', 8.0, '🍗');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (8,  'Frango Barbecue',    23.00, 'Frango grelhado com molho barbecue defumado',      true, 1, 'Frango', 8.5, '🍗');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (9,  'Frango Parmegiana',  25.00, 'Frango empanado com molho de tomate e mussarela',  true, 1, 'Frango', 9.5, '🍗');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (10, 'Frango Catupiry',    24.00, 'Frango desfiado com catupiry e orégano',           true, 1, 'Frango', 9.0, '🍗');

-- Produtos — Hambúrgueres / Calabresa
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (11, 'X-Calabresa',        20.00, 'Calabresa artesanal, cebola caramelizada e queijo', true, 1, 'Calabresa', 7.0, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (12, 'Calabresa Defumada', 24.00, 'Linguiça defumada, pimentão e molho da casa',       true, 1, 'Calabresa', 9.0, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (13, 'Calabresa Smash',    27.00, 'Blend de calabresa smash com queijo e cebola roxa', true, 1, 'Calabresa', 10.5, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (14, 'Calabresa + Ovo',    22.00, 'Calabresa fatiada com ovo frito e catupiry',        true, 1, 'Calabresa', 8.0, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (15, 'Duplo Calabresa',    30.00, 'Dois blends de calabresa com queijo e picles',      true, 1, 'Calabresa', 12.0, '🍔');

-- Produtos — Hambúrgueres / Clássicos
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (16, 'X-Burger',           12.00, 'Pão brioche, blend 150g, alface e tomate',   true, 1, 'Clássicos', 5.0, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (17, 'X-Egg',              15.00, 'Com ovo frito e queijo prato',                true, 1, 'Clássicos', 6.0, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (18, 'Artesanal Cheddar',  26.00, 'Blend 180g, cheddar duplo e picles artesanal', true, 1, 'Clássicos', 10.0, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (19, 'Artesanal Duplo',    32.00, 'Dois blends 180g, queijo e molho da casa',    true, 1, 'Clássicos', 13.0, '🍔');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (20, 'Veggie Burger',      22.00, 'Blend de legumes, queijo vegano e alface',    true, 1, 'Clássicos', 7.0, '🥗');

-- Produtos — Batata Frita
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (21, 'Batata Simples',   14.00, 'Batata palito crocante com sal e tempero da casa',    true, 2, 'Tradicionais', 4.0, '🍟');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (22, 'Batata Cheddar',   18.00, 'Batata palito com cheddar cremoso derretido',         true, 2, 'Tradicionais', 5.5, '🍟');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (23, 'Batata Bacon',     20.00, 'Batata crocante com bacon em pedaços e cheddar',      true, 2, 'Tradicionais', 6.5, '🍟');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (24, 'Batata Frango',    22.00, 'Batata com frango desfiado temperado e catupiry',     true, 2, 'Tradicionais', 7.0, '🍟');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (25, 'Batata Diana',     26.00, 'Batata com blend de carnes, cheddar e molho especial', true, 2, 'Especiais', 8.5, '🍟');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (26, 'Batata Calabresa', 24.00, 'Batata com calabresa artesanal, pimentão e cebola',    true, 2, 'Especiais', 7.5, '🍟');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (27, 'Batata Veggie',    19.00, 'Batata com legumes grelhados e molho pesto',           true, 2, 'Especiais', 5.5, '🍟');

-- Produtos — Bebidas
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (28, 'Coca-Cola',          8.00,  'Lata 350ml geladinha',                 true, 3, 'Geladas', 3.5, '🥤');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (29, 'Guaraná Antarctica', 7.00,  'Lata 350ml geladinha',                 true, 3, 'Geladas', 3.0, '🥤');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (30, 'Água s/ Gás',        4.00,  '500ml',                                true, 3, 'Geladas', 1.5, '💧');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (31, 'Cerveja',            9.00,  'Long neck 355ml',                      true, 3, 'Geladas', 4.0, '🍺');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (32, 'Suco de Laranja',    9.00,  'Natural, feito na hora 500ml',         true, 3, 'Naturais', 3.5, '🍊');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (33, 'Suco de Morango',    10.00, 'Natural com morango fresco 500ml',     true, 3, 'Naturais', 4.0, '🍓');
INSERT INTO produto (id_produto, nome, preco, descricao, disponivel, id_categoria, subcategoria, custo, emoji) VALUES (34, 'Vitamina de Banana', 10.00, 'Com leite e mel 400ml',                true, 3, 'Naturais', 3.8, '🍌');

-- Avança os contadores de ID pra não colidir com futuros INSERTs automáticos
ALTER TABLE categoria ALTER COLUMN id_categoria RESTART WITH 5;
ALTER TABLE produto ALTER COLUMN id_produto RESTART WITH 35;
