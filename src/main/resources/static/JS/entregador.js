// ════════════════════════════════════════
//  TELA ENTREGADOR — Diana Burguer's
// ════════════════════════════════════════

// Base da API — o backend roda com context-path /DianaBurgers
const API_BASE = '/DianaBurgers';

let PEDIDOS_DRV = [];

const PAY_ICON = { pix: '💠 PIX', credito: '💳 Crédito', debito: '💳 Débito', dinheiro: '💵 Dinheiro' };

// ── CARREGAMENTO DE DADOS (API) ────────
async function carregarEntregas() {
  try {
    const [pedRes, itensRes, prodRes] = await Promise.all([
      fetch(`${API_BASE}/pedido`, { cache: 'no-store' }),
      fetch(`${API_BASE}/itens`, { cache: 'no-store' }),
      fetch(`${API_BASE}/produto`, { cache: 'no-store' }),
    ]);
    const pedidosRaw  = pedRes.ok   ? await pedRes.json()   : [];
    const itensRaw    = itensRes.ok ? await itensRes.json() : [];
    const produtosRaw = prodRes.ok  ? await prodRes.json()  : [];

    const emojiPorNome = {};
    produtosRaw.forEach(p => { emojiPorNome[p.nome] = p.emoji || '🍔'; });

    const itensPorPedido = {};
    itensRaw.forEach(i => {
      if (!itensPorPedido[i.idPedido]) itensPorPedido[i.idPedido] = [];
      itensPorPedido[i.idPedido].push({
        emoji: emojiPorNome[i.nomeProduto] || '🍔',
        nome: i.nomeProduto, preco: Number(i.precoUnit), qty: i.quantidade,
      });
    });

    PEDIDOS_DRV = pedidosRaw
      .filter(p => p.tipoEntrega === 'delivery' && !(p.status || '').toLowerCase().includes('cancel'))
      .map(p => ({
        id: p.idPedido,
        cliente: p.nomeUsuario || 'Cliente',
        telefone: p.telefoneUsuario || '—',
        endereco: p.enderecoEntregaTexto || '',
        obs: p.observacao || '',
        itens: itensPorPedido[p.idPedido] || [],
        total: Number(p.valorTotal) || 0,
        pagamento: p.formaPag,
        status: (p.status || '').toLowerCase().includes('entreg') && !(p.status || '').toLowerCase().includes('em ') ? 'entregue' : 'pendente',
        hora: p.dataPedido ? new Date(p.dataPedido).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
      }))
      .sort((a, b) => b.id - a.id);

    renderComandas();
  } catch (e) {
    console.error('Erro ao carregar entregas:', e);
    toastDrv('❌ Não foi possível carregar os pedidos da API');
  }
}

// ──────────────────────────────────────
async function marcarEntregue(id) {
  try {
    const res = await fetch(`${API_BASE}/pedido/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'entregue' })
    });
    if (!res.ok) { toastDrv('❌ Não foi possível atualizar o pedido'); return; }
    const p = PEDIDOS_DRV.find(x => x.id === id);
    if (p) p.status = 'entregue';
    renderComandas();
    toastDrv('✅ Pedido #' + id + ' marcado como entregue!');
  } catch (e) {
    console.error(e);
    toastDrv('❌ Não foi possível conectar ao servidor');
  }
}

// ──────────────────────────────────────
function renderComandas() {
  const todos     = PEDIDOS_DRV;
  const pendentes = todos.filter(p => p.status === 'pendente');
  const entregues = todos.filter(p => p.status === 'entregue');

  document.getElementById('drv-count-pend').textContent = pendentes.length;
  document.getElementById('drv-count-done').textContent = entregues.length;

  const ordenados = [...pendentes, ...entregues];

  const el = document.getElementById('drv-lista');
  if (!el) return;

  if (!todos.length) {
    el.innerHTML = `
      <div class="drv-empty">
        <div class="drv-empty-icon">🛵</div>
        <h3>Nenhuma entrega</h3>
        <p>Quando houver pedidos delivery, as comandas aparecerão aqui.</p>
      </div>`;
    return;
  }

  el.innerHTML = ordenados.map(p => {
    const entregue = p.status === 'entregue';
    const iniciais = p.cliente.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const enderecoHTML = p.endereco
      ? `<div class="comanda-endereco">
           <div class="comanda-endereco-icon">📍</div>
           <div class="comanda-endereco-txt">${p.endereco}</div>
         </div>`
      : `<div class="comanda-retirada">🏪 Retirada no balcão</div>`;

    const obsHTML = p.obs
      ? `<div class="comanda-obs">⚠️ <span><strong>Obs:</strong> ${p.obs}</span></div>`
      : '';

    const itensHTML = p.itens.map(i => `
      <div class="comanda-item">
        <div class="ci-left">
          <span class="ci-emoji">${i.emoji}</span>
          <span>${i.nome}</span>
          <span class="ci-qty">${i.qty}×</span>
        </div>
        <span class="ci-preco">R$ ${(i.preco * i.qty).toFixed(2).replace('.', ',')}</span>
      </div>`).join('');

    const btnHTML = entregue
      ? `<button class="btn-entregue">✅ Entregue</button>`
      : `<button class="btn-entregar" onclick="marcarEntregue(${p.id})">🛵 Marcar entregue</button>`;

    return `
      <div class="comanda ${entregue ? 'entregue' : ''}">
        <div class="comanda-header">
          <div class="comanda-num ${entregue ? 'entregue' : ''}">#${p.id}</div>
          <div class="comanda-hora">🕐 ${p.hora}</div>
        </div>
        <div class="comanda-body">
          <div class="comanda-cliente">
            <div class="comanda-avatar ${entregue ? 'verde' : ''}">${iniciais}</div>
            <div>
              <div class="comanda-cliente-nome">${p.cliente}</div>
              <div class="comanda-cliente-tel">📞 ${p.telefone}</div>
            </div>
          </div>
          ${enderecoHTML}
          ${obsHTML}
          <div class="comanda-itens">${itensHTML}</div>
        </div>
        <div class="comanda-footer">
          <div>
            <div class="comanda-total ${entregue ? 'entregue' : ''}">
              R$ ${p.total.toFixed(2).replace('.', ',')}
            </div>
            <div class="comanda-pag">${PAY_ICON[p.pagamento] || '💰 ' + p.pagamento}</div>
          </div>
          ${btnHTML}
        </div>
      </div>`;
  }).join('');
}

// ──────────────────────────────────────
function toastDrv(msg) {
  const t = document.getElementById('toast-drv');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  carregarEntregas();
  // Atualiza automaticamente a cada 20s pra pegar pedidos novos
  setInterval(carregarEntregas, 20000);
});
