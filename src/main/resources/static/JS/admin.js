// ════════════════════════════════════════
//  PAINEL ADMIN — Diana Burguer's
// ════════════════════════════════════════
// Observação: API_BASE já é declarado em global.js, carregado antes deste arquivo.

let adminUser = null;

// Dados carregados da API (ver carregarTudo())
let CATEGORIAS = [];
let PRODUTOS   = [];
let PEDIDOS    = [];
let CLIENTES   = [];

// Mapa entre os status "amigáveis" do painel e os valores salvos no banco
const STATUS_LABEL = { pending: 'Pendente', done: 'Concluído', cancel: 'Cancelado' };
const STATUS_CLASS = { pending: 's-pending', done: 's-done', cancel: 's-cancel' };
const STATUS_PARA_BACKEND = { pending: 'em preparo', done: 'entregue', cancel: 'cancelado' };

function mapStatusBackend(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('entreg') && !s.includes('em ')) return 'done'; // "entregue" mas não "em entrega"
  if (s.includes('cancel')) return 'cancel';
  return 'pending';
}

// ── SESSÃO (chave compartilhada com global.js) ──
const SESS_KEY = 'diana_admin_session';

function salvarSessaoAdmin(u) { sessionStorage.setItem(SESS_KEY, JSON.stringify(u)); }
function carregarSessaoAdmin() {
  try {
    const s = sessionStorage.getItem(SESS_KEY);
    if (!s) return null;
    const u = JSON.parse(s);
    return (u && (u.role === 'admin' || u.role === 'funcionario')) ? u : null;
  } catch { return null; }
}
function limparSessaoAdmin() { sessionStorage.removeItem(SESS_KEY); }

// ── LOGIN ─────────────────────────────
async function tentarLogin() {
  const email = document.getElementById('adm-email').value.trim().toLowerCase();
  const senha = document.getElementById('adm-senha').value;
  const err   = document.getElementById('adm-erro');

  if (!email || !senha) { err.textContent = '⚠️ Preencha e-mail e senha.'; return; }

  try {
    const res = await fetch(`${API_BASE}/usuario/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    if (!res.ok) { err.textContent = '❌ Credenciais inválidas.'; setTimeout(() => err.textContent = '', 3000); return; }

    const usuario = await res.json();
    if (usuario.role !== 'admin' && usuario.role !== 'funcionario') {
      err.textContent = '⚠️ Essa conta não tem acesso ao painel.';
      setTimeout(() => err.textContent = '', 3000);
      return;
    }
    salvarSessaoAdmin(usuario);
    await entrarPainel(usuario);
  } catch (e) {
    console.error(e);
    err.textContent = '❌ Não foi possível conectar ao servidor.';
  }
}

async function entrarPainel(u) {
  adminUser = u;
  document.getElementById('tela-login').style.display  = 'none';
  document.getElementById('tela-painel').style.display = 'block';
  const nb = document.getElementById('admin-nome');
  if (nb) nb.textContent = u.nome + (u.role === 'admin' ? ' (Admin)' : ' (Funcionário)');
  if (u.role === 'funcionario') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  }
  await carregarTudo();
  irAba('dash');
}

function sairAdmin() {
  adminUser = null;
  limparSessaoAdmin();
  document.getElementById('tela-painel').style.display = 'none';
  document.getElementById('tela-login').style.display  = 'flex';
  document.getElementById('adm-email').value = '';
  document.getElementById('adm-senha').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const sessaoAtiva = carregarSessaoAdmin();
  if (sessaoAtiva) {
    entrarPainel(sessaoAtiva);
  } else {
    document.getElementById('tela-login').style.display = 'flex';
    document.getElementById('tela-painel').style.display = 'none';
  }
  document.getElementById('adm-senha')?.addEventListener('keydown', e => { if (e.key === 'Enter') tentarLogin(); });
  document.getElementById('adm-email')?.addEventListener('keydown', e => { if (e.key === 'Enter') tentarLogin(); });
});

// ── CARREGAMENTO DE DADOS (API) ────────
async function carregarTudo() {
  try {
    const [catRes, prodRes, pedRes, itensRes, userRes] = await Promise.all([
      fetch(`${API_BASE}/categoria`, { cache: 'no-store' }),
      fetch(`${API_BASE}/produto`, { cache: 'no-store' }),
      fetch(`${API_BASE}/pedido`, { cache: 'no-store' }),
      fetch(`${API_BASE}/itens`, { cache: 'no-store' }),
      fetch(`${API_BASE}/usuario`, { cache: 'no-store' }),
    ]);

    CATEGORIAS = catRes.ok ? await catRes.json() : [];
    const produtosRaw = prodRes.ok ? await prodRes.json() : [];
    const pedidosRaw  = pedRes.ok  ? await pedRes.json()  : [];
    const itensRaw    = itensRes.ok ? await itensRes.json() : [];
    const usuariosRaw = userRes.ok ? await userRes.json() : [];

    PRODUTOS = produtosRaw.map(p => ({
      id: p.idProduto, name: p.nome, cat: p.nomeCategoria || '', idCategoria: p.idCategoria,
      price: Number(p.preco), cost: Number(p.custo) || 0, desc: p.descricao || '',
      emoji: p.emoji || '🍔', subcategoria: p.subcategoria || '', imagem: p.imagemBase64 || null,
    }));

    const itensPorPedido = {};
    itensRaw.forEach(i => {
      if (!itensPorPedido[i.idPedido]) itensPorPedido[i.idPedido] = [];
      itensPorPedido[i.idPedido].push({ id: i.idProduto, name: i.nomeProduto, qty: i.quantidade, price: Number(i.precoUnit) });
    });

    PEDIDOS = pedidosRaw.map(p => ({
      id: p.idPedido, userId: p.idUsuario, userName: p.nomeUsuario || '—', userPhone: p.telefoneUsuario || '—',
      payment: p.formaPag, status: mapStatusBackend(p.status),
      total: Number(p.valorTotal) || 0, date: p.dataPedido ? new Date(p.dataPedido).toLocaleString('pt-BR') : '',
      items: itensPorPedido[p.idPedido] || [],
    })).sort((a, b) => b.id - a.id);

    CLIENTES = usuariosRaw.filter(u => u.role === 'cliente');

    popularSelectCategorias();
  } catch (e) {
    console.error('Erro ao carregar dados do painel:', e);
    toastAdmin('❌ Não foi possível carregar os dados da API');
  }
}

function popularSelectCategorias() {
  const sel = document.getElementById('p-cat');
  if (!sel) return;
  const atual = sel.value;
  sel.innerHTML = CATEGORIAS.map(c => `<option value="${c.idCategoria}">${c.nome}</option>`).join('');
  if (atual) sel.value = atual;
}

// ── ABAS ─────────────────────────────
function irAba(aba) {
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  document.querySelector(`[data-aba="${aba}"]`)?.classList.add('active');
  document.querySelectorAll('.a-sec').forEach(el => el.classList.remove('active'));
  document.getElementById('a-' + aba)?.classList.add('active');
  const map = { dash:renderDash, orders:renderOrders, prods:renderProds, fin:renderFin, top:renderTop, users:renderUsers };
  if (map[aba]) map[aba]();
}

// ── DASHBOARD ─────────────────────────
function renderDash() {
  const valid = PEDIDOS.filter(o => o.status !== 'cancel');
  const rev   = valid.reduce((s, o) => s + o.total, 0);
  document.getElementById('d-orders').textContent = PEDIDOS.length;
  document.getElementById('d-rev').textContent    = 'R$' + rev.toFixed(2).replace('.', ',');
  document.getElementById('d-prods').textContent  = PRODUTOS.length;
  document.getElementById('d-users').textContent  = CLIENTES.length;
  document.getElementById('dash-tbody').innerHTML = PEDIDOS.slice(0, 5).map(o =>
    `<tr><td><strong>#${o.id}</strong></td><td>${o.userName}</td>
     <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.items.map(i => i.qty + '× ' + i.name).join(', ')}</td>
     <td><strong>R$${o.total.toFixed(2).replace('.', ',')}</strong></td>
     <td><span class="status-badge ${STATUS_CLASS[o.status]}">${STATUS_LABEL[o.status]}</span></td></tr>`
  ).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text2);padding:24px">Nenhum pedido ainda</td></tr>';
}

// ── PEDIDOS ───────────────────────────
function renderOrders() {
  document.getElementById('orders-tbody').innerHTML = PEDIDOS.map(o =>
    `<tr>
      <td><strong>#${o.id}</strong></td><td>${o.userName}</td>
      <td style="max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.items.map(i => i.qty + '× ' + i.name).join(', ')}</td>
      <td><strong>R$${o.total.toFixed(2).replace('.', ',')}</strong></td>
      <td style="font-size:12px">${o.userPhone}</td><td>${o.payment}</td>
      <td><span class="status-badge ${STATUS_CLASS[o.status]}">${STATUS_LABEL[o.status]}</span></td>
      <td><select style="font-size:12px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;cursor:pointer"
            onchange="updOrdStatus(${o.id},this.value)">
          <option value="pending" ${o.status==='pending'?'selected':''}>Pendente</option>
          <option value="done"    ${o.status==='done'   ?'selected':''}>Concluído</option>
          <option value="cancel"  ${o.status==='cancel' ?'selected':''}>Cancelado</option>
        </select></td>
    </tr>`
  ).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--text2);padding:24px">Nenhum pedido</td></tr>';
}

async function updOrdStatus(id, status) {
  try {
    const res = await fetch(`${API_BASE}/pedido/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: STATUS_PARA_BACKEND[status] || status })
    });
    if (!res.ok) { toastAdmin('❌ Não foi possível atualizar o status'); return; }
    const o = PEDIDOS.find(x => x.id === id);
    if (o) o.status = status;
    toastAdmin('✅ Status atualizado!');
    renderDash();
  } catch (e) {
    console.error(e);
    toastAdmin('❌ Não foi possível conectar ao servidor');
  }
}

// ── PRODUTOS ──────────────────────────
let editProdId = null;
let imgProdAtual = null; // base64 da imagem selecionada no formulário
function renderProds() {
  document.getElementById('prods-grid').innerHTML = PRODUTOS.map(p =>
    `<div class="prod-card">
      ${p.imagem
        ? `<img src="${p.imagem}" class="pi" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`
        : `<div class="pi">${p.emoji}</div>`}
      <div class="prod-body">
        <div class="prod-name">${p.name}</div>
        <div class="prod-cat">${p.cat}</div>
        <div class="prod-foot">
          <div class="prod-price">R$${p.price.toFixed(2).replace('.', ',')}</div>
          <div class="act-btns">
            <button class="icon-btn" onclick="editProd(${p.id})">✏️</button>
            <button class="icon-btn danger" onclick="delProd(${p.id})">🗑️</button>
          </div>
        </div>
      </div>
    </div>`
  ).join('');
}

// Lê o arquivo escolhido, redimensiona num canvas (máx. 500px) e comprime em JPEG,
// pra não pesar no banco nem na requisição.
function onProdImgChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 500;
      let { width, height } = img;
      if (width > height && width > MAX) { height *= MAX / width; width = MAX; }
      else if (height > MAX) { width *= MAX / height; height = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      imgProdAtual = canvas.toDataURL('image/jpeg', 0.8);
      atualizarPreviewImg();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function atualizarPreviewImg() {
  const prev = document.getElementById('p-img-preview');
  const btnRemover = document.getElementById('p-img-remove');
  if (imgProdAtual) {
    prev.src = imgProdAtual; prev.style.display = 'block';
    btnRemover.style.display = 'inline-flex';
  } else {
    prev.style.display = 'none';
    btnRemover.style.display = 'none';
  }
}

function removerImagemProd() {
  imgProdAtual = null;
  document.getElementById('p-img').value = '';
  atualizarPreviewImg();
}

async function saveProd() {
  const name  = document.getElementById('p-name').value.trim();
  const price = parseFloat(document.getElementById('p-price').value) || 0;
  const idCategoria = parseInt(document.getElementById('p-cat').value, 10);
  if (!name || !price)     { toastAdmin('⚠️ Preencha nome e preço!'); return; }
  if (!idCategoria)        { toastAdmin('⚠️ Selecione uma categoria!'); return; }

  const payload = {
    nome: name,
    preco: price,
    descricao: document.getElementById('p-desc').value.trim(),
    custo: parseFloat(document.getElementById('p-cost').value) || 0,
    emoji: document.getElementById('p-emoji').value.trim() || '🍔',
    imagemBase64: imgProdAtual,
    disponivel: true,
    categoria: { idCategoria },
  };

  try {
    let res;
    if (editProdId) {
      res = await fetch(`${API_BASE}/produto`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idProduto: editProdId, ...payload })
      });
    } else {
      res = await fetch(`${API_BASE}/produto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      toastAdmin('⚠️ ' + (err?.message || 'Não foi possível salvar o produto'));
      return;
    }
    toastAdmin(editProdId ? '✅ Produto atualizado!' : '✅ Produto adicionado!');
    resetPF();
    await carregarTudo();
    renderProds();
  } catch (e) {
    console.error(e);
    toastAdmin('❌ Não foi possível conectar ao servidor');
  }
}

function editProd(id) {
  const p = PRODUTOS.find(x => x.id === id); if (!p) return;
  editProdId = id;
  document.getElementById('p-name').value  = p.name;
  document.getElementById('p-cat').value   = p.idCategoria;
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-cost').value  = p.cost || '';
  document.getElementById('p-desc').value  = p.desc;
  document.getElementById('p-emoji').value = p.emoji;
  imgProdAtual = p.imagem || null;
  atualizarPreviewImg();
  document.getElementById('pf-title').textContent = '✏️ Editando: ' + p.name;
  document.getElementById('cancel-edit').style.display = 'inline-flex';
  window.scrollTo(0, 0);
}
function resetPF() {
  editProdId = null;
  imgProdAtual = null;
  ['p-name','p-price','p-cost','p-desc','p-emoji','p-img'].forEach(id => document.getElementById(id).value = '');
  atualizarPreviewImg();
  document.getElementById('pf-title').textContent = '➕ Adicionar produto';
  document.getElementById('cancel-edit').style.display = 'none';
}
async function delProd(id) {
  if (!confirm('Excluir produto?')) return;
  try {
    const res = await fetch(`${API_BASE}/produto/${id}`, { method: 'DELETE' });
    if (!res.ok) { toastAdmin('❌ Não foi possível excluir (pode estar associado a pedidos existentes)'); return; }
    await carregarTudo();
    renderProds();
    toastAdmin('🗑️ Produto removido.');
  } catch (e) {
    console.error(e);
    toastAdmin('❌ Não foi possível conectar ao servidor');
  }
}

// ── PROMOÇÃO / INFO DA LOJA ────────────
// (ainda locais nesta versão — não há endpoint de configuração da loja na API)
function savePromo() { toastAdmin('✅ Promoção salva (localmente nesta versão)!'); }
function toggleBanner() {
  const on = document.getElementById('promo-on').checked;
  document.getElementById('promo-lbl').textContent = on ? 'Ativado' : 'Desativado';
}
function saveStore() { toastAdmin('✅ Informações atualizadas (localmente nesta versão)!'); }

// ── FINANCEIRO ────────────────────────
function renderFin() {
  const done = PEDIDOS.filter(o => o.status !== 'cancel');
  const rev  = done.reduce((s, o) => s + o.total, 0);
  let cost = 0;
  done.forEach(o => o.items.forEach(i => { const p = PRODUTOS.find(x => x.id === i.id); if (p && p.cost) cost += p.cost * i.qty; }));
  const profit = rev - cost;
  const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : 0;
  document.getElementById('f-rev').textContent    = 'R$' + rev.toFixed(2).replace('.', ',');
  document.getElementById('f-cost').textContent   = 'R$' + cost.toFixed(2).replace('.', ',');
  document.getElementById('f-profit').textContent = 'R$' + profit.toFixed(2).replace('.', ',');
  document.getElementById('f-margin').textContent = margin + '%';
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const curr = new Date().getMonth();
  const fake = months.map((_, i) => i < curr ? 0 : i === curr ? rev : 0);
  const mx = Math.max(...fake, 1);
  document.getElementById('mo-chart').innerHTML  = fake.map((v, i) => `<div class="mo-bar-wrap"><div class="mo-bar ${i===curr?'curr':''}" style="height:${(v/mx)*120}px" title="R$${v.toFixed(0)}"></div></div>`).join('');
  document.getElementById('mo-labels').innerHTML = months.map(m => `<span style="font-size:10px;color:var(--text2)">${m}</span>`).join('');
}

// ── TOP VENDAS ────────────────────────
function renderTop() {
  const counts = {};
  PEDIDOS.filter(o => o.status !== 'cancel').forEach(o => o.items.forEach(i => { counts[i.name] = (counts[i.name] || 0) + i.qty; }));
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const mx = sorted[0] ? sorted[0][1] : 1;
  document.getElementById('top-chart').innerHTML = sorted.map(([n, q]) =>
    `<div class="chart-row">
      <div class="cr-label">${n}</div>
      <div class="cr-bar-wrap"><div class="cr-bar" style="width:${(q/mx)*100}%"></div></div>
      <div class="cr-val">${q} pedidos</div>
    </div>`).join('') || '<div style="text-align:center;color:var(--text2);padding:24px">Nenhuma venda ainda</div>';
}

// ── CLIENTES ─────────────────────────
function renderUsers() {
  document.getElementById('users-tbody').innerHTML = CLIENTES.map(u => {
    const ords  = PEDIDOS.filter(o => o.userId === u.id && o.status !== 'cancel');
    const spent = ords.reduce((s, o) => s + o.total, 0);
    return `<tr>
      <td><strong>${u.nome}</strong></td>
      <td>${u.email}</td><td>${u.telefone || '—'}</td>
      <td style="font-size:12px;color:var(--text2)">—</td>
      <td>${ords.length}</td>
      <td><strong>R$${spent.toFixed(2).replace('.', ',')}</strong></td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text2);padding:24px">Nenhum cliente ainda</td></tr>';
}

// ── ÁREA DO ENTREGADOR ───────────────
function goDrv() { window.location.href = 'entregador.html'; }

// ── TOAST ADMIN ───────────────────────
function toastAdmin(msg) {
  const t = document.getElementById('toast-admin');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
