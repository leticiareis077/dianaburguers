// ════════════════════════════════════════
//  GLOBAL — Diana Burguer's
//  Auth, carrinho, checkout, perfil, toast
// ════════════════════════════════════════

// Base da API — o backend roda com context-path /DianaBurgers (ver application.properties)
const API_BASE = '/DianaBurgers';

const DB = {
  users: [
    { id:'admin', email:'admin@dianaburgers.com', pass:'admin123', name:'Admin',  last:'',       phone:'', role:'admin',       address:{}, payment:{} },
    { id:'func1', email:'func@dianaburgers.com',  pass:'func123',  name:'Carlos', last:'Silva',  phone:'', role:'funcionario', address:{}, payment:{} },
  ],
  // Produtos agora vêm da API (ver carregarCardapio()). Começa vazio.
  products: [],
  orders: [],
  nextOrdId: 1001,
  nextUsrId: 10,
  promo: { ativo: true, titulo: '🔥 Combo do Dia — Só hoje!', desc: 'X-Bacon + Guaraná por R$24,00' },
  store: { nome:"Diana Burguer's", addr:'Parque da Sementeira, Aracaju - SE', hours:'Seg–Dom: 11h–22h', phone:'(79) 9 9999-0000', insta:'@dianaburgers', deliv:'Taxa: R$5,00 · Mínimo: R$25,00 · 30–45 min' },
};

let CU   = null;
let cart = [];

// ── CARDÁPIO (API) ───────────────────────
// Busca categorias e produtos reais do backend e preenche DB.products.
// Dispara o evento 'diana:cardapio-pronto' quando terminar, para as telas
// que já estão montadas poderem se re-renderizar.
async function carregarCardapio() {
  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${API_BASE}/categoria`, { cache: 'no-store' }),
      fetch(`${API_BASE}/produto`, { cache: 'no-store' })
    ]);
    if (!catRes.ok || !prodRes.ok) throw new Error('Falha ao consultar a API do cardápio');

    const categorias = await catRes.json();
    const produtos    = await prodRes.json();

    const nomeDaCategoria = {};
    categorias.forEach(c => { nomeDaCategoria[c.idCategoria] = c.nome; });

    DB.products = produtos
      .filter(p => p.disponivel)
      .map(p => {
        try {
          const cat = p.nomeCategoria || nomeDaCategoria[p.idCategoria] || 'Outros';
          return {
            id:    p.idProduto,
            name:  p.nome,
            cat:   cat,
            sub:   p.subcategoria || null,
            price: Number(p.preco),
            desc:  p.descricao || '',
            imagem: p.imagemBase64 || null,
            emoji: (typeof getCatEmoji === 'function') ? getCatEmoji(cat) : '🍔'
          };
        } catch (itemErr) {
          console.error('Produto inválido, ignorado:', p, itemErr);
          return null;
        }
      })
      .filter(Boolean);
  } catch (err) {
    console.error('Não foi possível carregar o cardápio da API:', err);
    toast('Não foi possível carregar o cardápio. Verifique se o backend está rodando.');
  } finally {
    window.dispatchEvent(new Event('diana:cardapio-pronto'));
  }
}

carregarCardapio();

// ── UTILS ─────────────────────────────
function isStaff() { return CU && (CU.role === 'admin' || CU.role === 'funcionario'); }

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── NAV ───────────────────────────────
function updateNav() {
  const el = document.getElementById('nav-auth');
  if (el) {
    if (CU) {
      const ini = (CU.name[0] + (CU.last ? CU.last[0] : CU.name[1] || '')).toUpperCase();
      const avatar = localStorage.getItem('diana_avatar_' + CU.id);
      const avatarHTML = avatar
        ? `<img src="${avatar}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0">`
        : `<div class="avatar">${ini}</div>`;
      el.innerHTML = `<div class="user-pill" onclick="goCliente()" title="Minha Conta">
        ${avatarHTML} ${CU.name}</div>`;
    } else {
      el.innerHTML = `<button class="btn btn-ghost btn-sm" onclick="openAuth('login')">Entrar</button>
        <button class="btn btn-primary btn-sm" onclick="openAuth('reg')">Cadastrar</button>`;
    }
  }
  const ab = document.getElementById('admin-btn');
  if (ab) ab.style.display = (CU && isStaff()) ? 'inline-flex' : 'none';
}

function showUserProfile() {
  goCliente();
}

// ── IR PARA ADMIN ──
function goAdmin() {
  if (!CU || !isStaff()) { toast('⚠️ Acesso restrito'); return; }
  sessionStorage.setItem('diana_admin_session', JSON.stringify({
    email: CU.email, role: CU.role, name: CU.name
  }));
  window.location.href = 'HTML/admin.html';
}

// ── IR PARA ÁREA DO CLIENTE ──
function goCliente() {
  window.location.href = 'HTML/cliente.html';
}

// ── AUTH ─────────────────────────────
function openAuth(mode = 'login') { switchAuth(mode); document.getElementById('auth-modal').classList.add('open'); }
function closeAuth() { document.getElementById('auth-modal').classList.remove('open'); }
function switchAuth(m) {
  document.getElementById('auth-login-view').style.display = m === 'login' ? 'block' : 'none';
  document.getElementById('auth-reg-view').style.display   = m === 'reg'   ? 'block' : 'none';
}
async function doLogin() {
  const email = document.getElementById('l-email').value.trim().toLowerCase();
  const pass  = document.getElementById('l-pass').value;
  if (!email || !pass) { toast('⚠️ Preencha e-mail e senha'); return; }

  try {
    const res = await fetch(`${API_BASE}/usuario/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: pass })
    });
    if (!res.ok) { toast('❌ E-mail ou senha inválidos'); return; }

    const usuario = await res.json();
    CU = usuarioParaCU(usuario);

    // Salva sessão para o cliente.html usar quando o usuário clicar no pill
    sessionStorage.setItem('diana_cliente_session', JSON.stringify(CU));

    // Admin/func → redireciona direto pro painel
    if (CU.role === 'admin' || CU.role === 'funcionario') {
      sessionStorage.setItem('diana_admin_session', JSON.stringify({ email: CU.email, role: CU.role, name: CU.name }));
      window.location.href = 'HTML/admin.html';
      return;
    }
    closeAuth();
    updateNav();
    toast('👋 Bem-vindo, ' + CU.name + '!');
  } catch (err) {
    console.error(err);
    toast('❌ Não foi possível conectar ao servidor');
  }
}

// Converte o UsuarioDTO retornado pela API para o formato que o front usa (CU).
function usuarioParaCU(usuario) {
  const partesNome = (usuario.nome || '').trim().split(' ');
  return {
    id:      usuario.id,
    name:    partesNome[0] || usuario.nome || '',
    last:    partesNome.slice(1).join(' '),
    email:   usuario.email,
    phone:   usuario.telefone,
    cpf:     usuario.cpf,
    role:    usuario.role || 'cliente',
    address: {},
    payment: {},
  };
}

async function doReg() {
  const name  = document.getElementById('r-name').value.trim();
  const last  = document.getElementById('r-last').value.trim();
  const email = document.getElementById('r-email').value.trim().toLowerCase();
  const phone = onlyDigits(document.getElementById('r-phone').value);
  const cpf   = onlyDigits(document.getElementById('r-cpf').value);
  const pass  = document.getElementById('r-pass').value;
  const pass2 = document.getElementById('r-pass2').value;
  if (!name || !email || !pass)  { toast('⚠️ Preencha os campos obrigatórios'); return; }
  if (!cpf || cpf.length !== 11) { toast('⚠️ Informe um CPF válido (11 dígitos)'); return; }
  if (!phone)                    { toast('⚠️ Informe um telefone'); return; }
  if (pass.length < 6)           { toast('⚠️ Senha mínima 6 caracteres'); return; }
  if (pass !== pass2)            { toast('⚠️ Senhas não coincidem'); return; }

  try {
    const res = await fetch(`${API_BASE}/usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: last ? `${name} ${last}` : name,
        email, cpf, telefone: phone,
        senhaUsuario: pass,
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      toast('⚠️ ' + (err?.message || 'Não foi possível criar a conta'));
      return;
    }
    const usuario = await res.json();
    CU = usuarioParaCU(usuario);
    sessionStorage.setItem('diana_cliente_session', JSON.stringify(CU));
    closeAuth();
    updateNav();
    toast('🎉 Conta criada! Bem-vindo(a), ' + CU.name + '!');
  } catch (err) {
    console.error(err);
    toast('❌ Não foi possível conectar ao servidor');
  }
}

function onlyDigits(str) { return (str || '').replace(/\D/g, ''); }
function logout() {
  CU = null;
  sessionStorage.removeItem('diana_admin_session');
  sessionStorage.removeItem('diana_cliente_session');
  if (typeof goHome === 'function') goHome();
  toast('👋 Até logo!');
}

// ── CARRINHO ──────────────────────────
function addToCart(id) {
  const p = DB.products.find(x => x.id === id); if (!p) return;
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++; else cart.push({ ...p, qty: 1 });
  renderCart(); toast('✅ ' + p.name + ' adicionado!');
}
function chgQty(id, d) {
  const i = cart.findIndex(x => x.id === id); if (i < 0) return;
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  renderCart();
}
function cartTot() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function renderCart() {
  const badge = document.getElementById('cart-badge');
  const total = document.getElementById('cart-total');
  const list  = document.getElementById('cart-list');
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
  if (total) total.textContent = 'R$' + cartTot().toFixed(2).replace('.', ',');
  if (!list) return;
  if (!cart.length) { list.innerHTML = '<div class="empty-cart"><div class="empty-icon">🛒</div><p>Carrinho vazio</p></div>'; return; }
  list.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-emoji">${i.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-price">R$${i.price.toFixed(2).replace('.', ',')}</div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="chgQty(${i.id},-1)">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="chgQty(${i.id},1)">+</button>
        </div>
      </div>
    </div>`).join('');
}
function toggleCart() { document.getElementById('cart-ov').classList.toggle('open'); }
function closeCartOut(e) { if (e.target === document.getElementById('cart-ov')) toggleCart(); }

// ── CHECKOUT ──────────────────────────
function openCheckout() {
  if (!cart.length) { toast('⚠️ Carrinho vazio!'); return; }
  if (!CU) {
    toggleCart();
    showAuthRequired();
    return;
  }
  const a = CU.address || {};
  document.getElementById('co-rua').value    = a.rua    || '';
  document.getElementById('co-num').value    = a.num    || '';
  document.getElementById('co-bairro').value = a.bairro || '';
  document.getElementById('co-comp').value   = a.comp   || '';
  document.getElementById('co-addr-hint').style.display = (a.rua && a.num) ? 'block' : 'none';
  const pay = CU.payment || {};
  if (pay.method) document.getElementById('co-pay').value = pay.method;
  document.getElementById('co-pay-hint').style.display = pay.method ? 'block' : 'none';
  document.getElementById('co-total').textContent = 'R$' + cartTot().toFixed(2).replace('.', ',');
  document.getElementById('checkout-modal').classList.add('open');
}
function showAuthRequired() {
  switchAuth('login');
  document.getElementById('auth-modal').classList.add('open');
  let warn = document.getElementById('auth-required-warn');
  if (!warn) {
    warn = document.createElement('div');
    warn.id = 'auth-required-warn';
    warn.style.cssText = 'background:var(--accent-light);border:1px solid rgba(214,40,40,.3);border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:12px;color:var(--accent);text-align:center';
    warn.innerHTML = '🛒 Para finalizar seu pedido, faça login ou <strong>cadastre-se grátis!</strong>';
    document.getElementById('auth-login-view').insertBefore(warn, document.getElementById('auth-login-view').firstChild);
  }
}
function closeCheckout() { document.getElementById('checkout-modal').classList.remove('open'); }
function toggleDelivFields() {
  document.getElementById('co-addr-fields').style.display =
    document.getElementById('co-deliv').value === 'delivery' ? 'block' : 'none';
}
async function confirmOrder() {
  if (!CU) return;
  const tipo = document.getElementById('co-deliv').value;
  let endereco = '';
  if (tipo === 'delivery') {
    const rua = document.getElementById('co-rua').value.trim();
    const num = document.getElementById('co-num').value.trim();
    if (!rua || !num) { toast('⚠️ Informe o endereço de entrega'); return; }
    const bairro = document.getElementById('co-bairro').value;
    endereco = `${rua}, ${num}${bairro ? ' — ' + bairro : ''}`;
  }
  const formaPag = document.getElementById('co-pay').value;
  const obs = document.getElementById('co-obs').value.trim();
  const itensCarrinho = cart.map(i => ({ ...i }));
  const total = cartTot();

  const btn = document.querySelector('#checkout-modal .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }

  try {
    // 1) Cria o pedido
    const resPedido = await fetch(`${API_BASE}/pedido`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: { id: CU.id },
        formaPag: formaPag,
        valorTotal: total,
        tipoEntrega: tipo,
        enderecoEntregaTexto: endereco,
        observacao: obs,
      })
    });
    if (!resPedido.ok) {
      const err = await resPedido.json().catch(() => null);
      toast('❌ ' + (err?.message || 'Não foi possível criar o pedido'));
      return;
    }
    const pedido = await resPedido.json();

    // 2) Cria cada item do pedido
    for (const item of itensCarrinho) {
      const resItem = await fetch(`${API_BASE}/itens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido:   { idPedido: pedido.idPedido },
          produto:  { idProduto: item.id },
          quantidade: item.qty,
          precoUnit:  item.price,
        })
      });
      if (!resItem.ok) {
        console.error('Falha ao salvar item do pedido', item);
      }
    }

    cart = [];
    renderCart(); closeCheckout();
    if (document.getElementById('cart-ov').classList.contains('open')) toggleCart();
    toast('🎉 Pedido #' + pedido.idPedido + ' realizado! Acompanhe em Minha Conta.');
  } catch (err) {
    console.error(err);
    toast('❌ Não foi possível conectar ao servidor. O pedido não foi salvo.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🎉 Confirmar Pedido'; }
  }
}

// ── PERFIL ────────────────────────────
function togglePayFields() {
  const m = document.getElementById('pay-method')?.value;
  if (!m) return;
  const isCard = m === 'credito' || m === 'debito';
  const pf = document.getElementById('pix-f'); if (pf) pf.style.display = m === 'pix' ? 'block' : 'none';
  const cf = document.getElementById('card-f'); if (cf) cf.style.display = isCard ? 'block' : 'none';
}
function saveAddr() {
  if (!CU) return;
  CU.address = { cep: document.getElementById('a-cep').value, bairro: document.getElementById('a-bairro').value, rua: document.getElementById('a-rua').value, num: document.getElementById('a-num').value, comp: document.getElementById('a-comp').value };
  toast('✅ Endereço salvo!');
}
function savePay() {
  if (!CU) return;
  CU.payment = { method: document.getElementById('pay-method').value, pixKey: document.getElementById('pay-pix').value, cardName: document.getElementById('pay-cn').value, cardNum: document.getElementById('pay-cnum').value, cardExp: document.getElementById('pay-cexp').value, cardBank: document.getElementById('pay-cbank').value };
  toast('✅ Dados de pagamento salvos!');
}
function saveAcct() {
  if (!CU) return;
  CU.name  = document.getElementById('ac-name').value.trim()  || CU.name;
  CU.last  = document.getElementById('ac-last').value.trim();
  CU.phone = document.getElementById('ac-phone').value.trim();
  updateNav(); toast('✅ Informações atualizadas!');
}
function chgPass() {
  if (!CU) return;
  const p = document.getElementById('ac-p1').value, p2 = document.getElementById('ac-p2').value;
  if (p.length < 6) { toast('⚠️ Senha muito curta'); return; }
  if (p !== p2)     { toast('⚠️ Senhas não coincidem'); return; }
  CU.pass = p;
  document.getElementById('ac-p1').value = '';
  document.getElementById('ac-p2').value = '';
  toast('✅ Senha alterada!');
}

// ── TEMA ─────────────────────────────
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('diana_theme', isLight ? 'light' : 'dark');
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = isLight ? '🌙' : '☀️';
}

// ── INIT ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Restaura tema
  const theme = localStorage.getItem('diana_theme');
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = '🌙';
  }
  renderCart();
  updateNav();
});
