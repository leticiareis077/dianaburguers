// ════════════════════════════════════════
//  TELA PRINCIPAL — Diana Burguer's
// ════════════════════════════════════════

// ── PÁGINAS ────────────────────────────
function showPg(id) {
  if (id === 'profile-pg') { window.location.href = 'HTML/cliente.html'; return; }
  document.querySelectorAll('#public-site .page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById(id);
  if (pg) { pg.classList.add('active'); window.scrollTo(0, 0); }
}
function goHome() {
  document.querySelectorAll('#public-site .page').forEach(p => p.classList.remove('active'));
  window.scrollTo(0, 0);
}

// ── CARDÁPIO ────────────────────────────
function getFavs() {
  try { return JSON.parse(localStorage.getItem('diana_favs') || '[]'); } catch { return []; }
}
function toggleFav(id, btn) {
  let favs = getFavs();
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    btn.classList.remove('fav-active');
    btn.title = 'Favoritar';
  } else {
    favs.push(id);
    btn.classList.add('fav-active');
    btn.title = 'Desfavoritar';
    // Pequena animação
    btn.style.transform = 'scale(1.4)';
    setTimeout(() => btn.style.transform = '', 200);
  }
  localStorage.setItem('diana_favs', JSON.stringify(favs));
}

function cardHTML(p) {
  try {
    const favs    = getFavs();
    const isFav   = favs.includes(p.id);
    const imgHTML = p.imagem
      ? `<img src="${p.imagem}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit" onerror="this.replaceWith(document.createTextNode('${p.emoji || '🍔'}'))">`
      : (p.emoji || '🍔');
    return `<div class="menu-card">
      <div class="menu-card-img">${imgHTML}</div>
      <div class="menu-card-body">
        <div class="menu-card-name">${p.name}</div>
        <div class="menu-card-desc">${p.desc}</div>
        <div class="menu-card-footer">
          <div class="price">R$${p.price.toFixed(2).replace('.', ',')}</div>
          <div style="display:flex;gap:6px;align-items:center">
            <button class="fav-btn${isFav?' fav-active':''}" onclick="toggleFav(${p.id},this)" title="${isFav?'Desfavoritar':'Favoritar'}">❤</button>
            <button class="add-btn" onclick="addToCart(${p.id})">+</button>
          </div>
        </div>
      </div>
    </div>`;
  } catch (e) {
    console.error('Erro ao renderizar produto, pulando:', p, e);
    return '';
  }
}

// Destaques: 3 produtos mais populares (1 de cada categoria)
function renderFeatured() {
  const el = document.getElementById('featured-grid');
  if (!el) return;
  const picks = ['Hambúrgueres', 'Batata Frita', 'Bebidas'].map(cat =>
    DB.products.find(p => p.cat === cat)
  ).filter(Boolean);
  el.innerHTML = picks.map(cardHTML).join('');
}

function getCatEmoji(cat) {
  return { 'Hambúrgueres':'🍔', 'Batata Frita':'🍟', 'Bebidas':'🥤', 'Sobremesas':'🍦' }[cat] || '🍽️';
}

// ── RENDER MENU COM SUB-ABAS ────────────
let _curCat = null;
let _curSub = null;

function renderMenuPg() {
  const cats = [...new Set(DB.products.map(p => p.cat))];
  const tabs = document.getElementById('cat-tabs');
  if (!tabs || tabs.dataset.init) return;

  tabs.innerHTML = cats.map((c, i) =>
    `<div class="tab ${i === 0 ? 'active' : ''}" onclick="selectCat('${c}',this)">${getCatEmoji(c)} ${c}</div>`
  ).join('');
  tabs.dataset.init = 1;

  // Renderiza a primeira categoria
  selectCat(cats[0], tabs.querySelector('.tab.active'));
}

function selectCat(cat, el) {
  document.querySelectorAll('#cat-tabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  _curCat = cat;

  // Descobre sub-categorias desta categoria
  const subs = [...new Set(DB.products.filter(p => p.cat === cat).map(p => p.sub))].filter(Boolean);
  const subContainer = document.getElementById('sub-tabs');
  
  if (subs.length > 1 && subContainer) {
    subContainer.style.display = 'flex';
    subContainer.innerHTML = subs.map((s, i) =>
      `<div class="sub-tab ${i === 0 ? 'active' : ''}" onclick="selectSub('${s}',this)">${s}</div>`
    ).join('');
    _curSub = subs[0];
  } else if (subContainer) {
    subContainer.style.display = 'none';
    _curSub = null;
  }

  filterGrid(cat, _curSub);
}

function selectSub(sub, el) {
  document.querySelectorAll('#sub-tabs .sub-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  _curSub = sub;
  filterGrid(_curCat, sub);
}

function filterGrid(cat, sub) {
  const items = DB.products.filter(p =>
    p.cat === cat && (!sub || p.sub === sub)
  );
  document.getElementById('menu-grid').innerHTML = items.map(cardHTML).join('');
}


function switchPTab(id, el) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ptab-sec').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('ptab-' + id).classList.add('active');
  if (id === 'orders') renderOrderHist();
}

function renderOrderHist() {
  const el = document.getElementById('order-hist');
  if (!el || !CU) return;
  const ords = DB.orders.filter(o => o.userId === CU.id);
  const smap = { pending:'s-pending', done:'s-done', cancel:'s-cancel' };
  const slbl = { pending:'Em preparo 🔥', done:'Entregue ✅', cancel:'Cancelado ❌' };
  if (!ords.length) {
    el.innerHTML = `<div class="empty-state">
      <div class="big-icon">📋</div>
      <p>Você ainda não fez nenhum pedido.</p><br>
      <button class="btn btn-primary" onclick="goHome();scrollSec('s-menu')">Ver cardápio</button>
    </div>`;
    return;
  }
  el.innerHTML = ords.map(o => `
    <div class="ord-item">
      <div class="ord-head">
        <div class="ord-id">Pedido #${o.id}</div>
        <div class="ord-date">${o.date}</div>
      </div>
      <div class="ord-items">${o.items.map(i => `<span class="ord-tag">${i.qty}× ${i.name}</span>`).join('')}</div>
      <div class="ord-detail">
        <span>📍 ${o.address}</span>
        <span>💳 ${o.payment}</span>
      </div>
      <div class="ord-foot">
        <div class="ord-total">R$${o.total.toFixed(2).replace('.', ',')}</div>
        <span class="status-badge ${smap[o.status]}">${slbl[o.status]}</span>
      </div>
    </div>`).join('');
}

// ── PROMO ────────────────────────────────
function renderPromo() {
  const p = DB.promo;
  const sec = document.getElementById('promo-sec');
  if (!sec) return;
  sec.style.display = p.ativo ? 'block' : 'none';
  const t = document.getElementById('promo-title');
  const d = document.getElementById('promo-desc');
  if (t) t.textContent = p.titulo;
  if (d) d.textContent = p.desc;
}

// ── INFO DA LOJA ─────────────────────────
function renderInfo() {
  const s = DB.store;
  const fa = document.getElementById('f-addr');
  const fh = document.getElementById('f-hours');
  const fp = document.getElementById('f-phone');
  if (fa) fa.textContent = s.addr;
  if (fh) fh.textContent = s.hours;
  if (fp) fp.textContent = s.phone;
}

// ── NAVBAR SCROLL ──────────────────────
function scrollSec(secId) {
  const el = document.getElementById(secId);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
function syncNavbar() {
  const secs = [
    { id:'s-inicio',   nav:'nav-inicio'   },
    { id:'s-sobre',    nav:'nav-sobre'    },
    { id:'s-menu',     nav:'nav-menu'     },
    { id:'s-endereco', nav:'nav-endereco' },
  ];
  const posY = window.scrollY + 120;
  let ativoId = 'nav-inicio';
  secs.forEach(({ id, nav }) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= posY) ativoId = nav;
  });
  document.querySelectorAll('.navbar a').forEach(a => a.classList.remove('ativo'));
  document.getElementById(ativoId)?.classList.add('ativo');
}

// ── INIT ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Restaura sessão do cliente ao voltar de cliente.html
  const sess = sessionStorage.getItem('diana_cliente_session');
  if (sess) {
    try { CU = JSON.parse(sess); } catch {}
  }
  updateNav();
  renderPromo();
  renderInfo();
  window.addEventListener('scroll', syncNavbar);
  syncNavbar();
  window.addEventListener('diana:cardapio-pronto', () => {
    try { renderFeatured(); } catch (e) { console.error('Erro ao renderizar destaques:', e); }
    try { renderMenuPg(); } catch (e) { console.error('Erro ao renderizar cardápio:', e); }
  });
});

// ══════════════════════════════════════
//  PERFIL — Área do Cliente (nova versão)
// ══════════════════════════════════════

// ── TABS ─────────────────────────────
function switchPTab2(id, el) {
  document.querySelectorAll('.ptab2').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ptab2-sec').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('ptab2-' + id).classList.add('active');
  if (id === 'orders') { renderOrderHist2(); renderClientStats(); }
  if (id === 'photo')  { renderAvatarTab(); }
}

// ── RENDER PERFIL ─────────────────────
function renderProfile() {
  if (!CU) { goHome(); openAuth('login'); return; }

  // Cabeçalho
  const ini = (CU.name[0] + (CU.last ? CU.last[0] : CU.name[1] || '')).toUpperCase();
  const img = document.getElementById('pav-img');
  const iniEl = document.getElementById('pav-ini');
  const savedAvatar = localStorage.getItem('diana_avatar_' + CU.id);
  if (savedAvatar && img && iniEl) {
    img.src = savedAvatar; img.style.display = 'block'; iniEl.style.display = 'none';
  } else if (img && iniEl) {
    img.style.display = 'none'; iniEl.style.display = 'block'; iniEl.textContent = ini;
  }
  document.getElementById('p-name-big').textContent  = CU.name + ' ' + (CU.last || '');
  document.getElementById('p-email-big').textContent = CU.email;
  const roleMap = { admin:'Admin ⚙️', funcionario:'Funcionário 👷', user:'🍔 Cliente' };
  const roleEl = document.getElementById('p-role-badge');
  if (roleEl) roleEl.textContent = roleMap[CU.role] || '🍔 Cliente';

  // Badge de membro dinâmico
  const memberEl = document.getElementById('p-member-badge');
  if (memberEl) {
    const doneCount = DB.orders.filter(o => o.userId === CU.id && o.status === 'done').length;
    if      (doneCount >= 10) memberEl.textContent = '🏆 VIP';
    else if (doneCount >= 5)  memberEl.textContent = '⭐ Fiel';
    else                      memberEl.textContent = '🆕 Novo';
  }

  // Campos de conta
  document.getElementById('ac-name').value  = CU.name  || '';
  document.getElementById('ac-last').value  = CU.last  || '';
  document.getElementById('ac-email').value = CU.email || '';
  document.getElementById('ac-phone').value = CU.phone || '';
  const birthEl = document.getElementById('ac-birth');
  if (birthEl) birthEl.value = CU.birth || '';

  // Endereço
  const a = CU.address || {};
  document.getElementById('a-cep').value    = a.cep    || '';
  document.getElementById('a-bairro').value = a.bairro || '';
  document.getElementById('a-rua').value    = a.rua    || '';
  document.getElementById('a-num').value    = a.num    || '';
  document.getElementById('a-comp').value   = a.comp   || '';
  document.getElementById('a-ref').value    = a.ref    || '';
  if (a.rua && a.num) showAddrMap(a);

  // Pagamento
  const py = CU.payment || {};
  document.getElementById('pay-method').value = py.method   || 'pix';
  document.getElementById('pay-pix').value    = py.pixKey   || '';
  document.getElementById('pay-cn').value     = py.cardName || '';
  document.getElementById('pay-cnum').value   = py.cardNum  || '';
  document.getElementById('pay-cexp').value   = py.cardExp  || '';
  document.getElementById('pay-cbank').value  = py.cardBank || '';
  togglePayFields();

  // Inicia na aba pedidos
  renderClientStats();
  renderOrderHist2();

  // Força a tab pedidos ativa
  document.querySelectorAll('.ptab2').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ptab2-sec').forEach(s => s.classList.remove('active'));
  const firstTab = document.querySelector('.ptab2');
  if (firstTab) firstTab.classList.add('active');
  const firstSec = document.getElementById('ptab2-orders');
  if (firstSec) firstSec.classList.add('active');
}

// ── STATS DO CLIENTE ─────────────────
function renderClientStats() {
  const el = document.getElementById('client-stats');
  if (!el || !CU) return;
  const ords  = DB.orders.filter(o => o.userId === CU.id);
  const done  = ords.filter(o => o.status === 'done');
  const total = done.reduce((s, o) => s + o.total, 0);
  const avg   = done.length ? (total / done.length) : 0;
  el.innerHTML = `
    <div class="cstat"><div class="cstat-num">${ords.length}</div><div class="cstat-label">Total de pedidos</div></div>
    <div class="cstat cstat-green"><div class="cstat-num">${done.length}</div><div class="cstat-label">Entregues</div></div>
    <div class="cstat"><div class="cstat-num">R$${total.toFixed(0)}</div><div class="cstat-label">Total gasto</div></div>
    <div class="cstat cstat-orange"><div class="cstat-num">R$${avg.toFixed(0)}</div><div class="cstat-label">Ticket médio</div></div>
  `;
}

// ── HISTÓRICO DE PEDIDOS ─────────────
let _ordFilter = 'all';
function filterOrds(status, el) {
  _ordFilter = status;
  document.querySelectorAll('.ord-filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderOrderHist2();
}

function renderOrderHist2() {
  const el = document.getElementById('order-hist2');
  if (!el || !CU) return;
  let ords = DB.orders.filter(o => o.userId === CU.id);
  if (_ordFilter !== 'all') ords = ords.filter(o => o.status === _ordFilter);

  if (!ords.length) {
    el.innerHTML = `<div class="empty-state">
      <div class="big-icon">${_ordFilter === 'all' ? '📋' : '🔍'}</div>
      <p>${_ordFilter === 'all' ? 'Você ainda não fez nenhum pedido.' : 'Nenhum pedido nessa categoria.'}</p><br>
      <button class="btn btn-primary" onclick="goHome();scrollSec('s-menu')">Ver cardápio</button>
    </div>`;
    return;
  }

  const smap = { pending:'pending', transit:'transit', done:'done', cancel:'cancel' };
  const slbl = { pending:'🔥 Em preparo', transit:'🛵 Em entrega', done:'✅ Entregue', cancel:'❌ Cancelado' };

  el.innerHTML = ords.map(o => `
    <div class="ord2-item">
      <div class="ord2-header">
        <div>
          <div class="ord2-id">Pedido #${o.id}</div>
          <div class="ord2-date">${o.date}</div>
        </div>
        <span class="sbadge ${smap[o.status] || o.status}">${slbl[o.status] || o.status}</span>
      </div>
      ${(o.status === 'pending' || o.status === 'transit') ? buildTracker(o.status) : ''}
      <div class="ord2-body">
        <div class="ord2-products">
          ${o.items.map(i => `<span class="ord2-tag">${i.emoji || '🍔'} ${i.qty}× ${i.name}</span>`).join('')}
        </div>
        <div class="ord2-meta">
          <span>📍 ${o.address}</span>
          <span>💳 ${o.payment}</span>
          <span>🚚 ${o.delivery === 'delivery' ? 'Delivery' : 'Retirada'}</span>
          ${o.obs ? `<span>📝 ${o.obs}</span>` : ''}
        </div>
        <div class="ord2-footer">
          <div class="ord2-total">R$${o.total.toFixed(2).replace('.', ',')}</div>
          <div class="ord2-actions">
            <button class="btn btn-ghost btn-sm" onclick="openOrdDetail(${o.id})">🧾 Detalhes</button>
            <button class="btn btn-primary btn-sm" onclick="repeatOrder(${o.id})">🔄 Repetir</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

// ── TRACKER DE STATUS ─────────────────
function buildTracker(status) {
  const steps = [
    { icon:'✅', label:'Confirmado' },
    { icon:'👨‍🍳', label:'Preparando' },
    { icon:'🛵', label:'Saiu p/ entrega' },
    { icon:'🏠', label:'Entregue' },
  ];
  const activeStep = status === 'pending' ? 1 : 2;
  let html = '<div class="ord2-tracker">';
  steps.forEach((s, i) => {
    const done   = i < activeStep;
    const active = i === activeStep;
    html += `<div class="tracker-step">
      <div class="tracker-dot ${done?'done':active?'active':''}">${done?'✓':s.icon}</div>
      <div class="tracker-label ${done?'done':active?'active':''}">${s.label}</div>
    </div>`;
    if (i < steps.length - 1)
      html += `<div class="tracker-line ${(done||active)?'done':''}"></div>`;
  });
  return html + '</div>';

}

// ── DETALHES DO PEDIDO ───────────────
function openOrdDetail(id) {
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;
  const slbl = { pending:'🔥 Em preparo', transit:'🛵 Em entrega', done:'✅ Entregue', cancel:'❌ Cancelado' };
  const content = `
    <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:1.3rem;color:var(--text2)">
      <span>${o.date}</span>
      <span class="sbadge ${o.status}">${slbl[o.status]}</span>
    </div>
    <div class="ord-detail-lines">
      ${o.items.map(i => `
        <div class="ord-detail-line">
          <span>${i.emoji || '🍔'} ${i.name} × ${i.qty}</span>
          <span>R$${(i.price * i.qty).toFixed(2).replace('.', ',')}</span>
        </div>`).join('')}
    </div>
    <div class="ord-detail-total"><span>Total</span><span>R$${o.total.toFixed(2).replace('.', ',')}</span></div>
    <div style="margin-top:16px;font-size:1.3rem;color:var(--text2);display:flex;flex-direction:column;gap:6px">
      <span>📍 ${o.address}</span>
      <span>💳 ${o.payment}</span>
      ${o.obs ? `<span>📝 ${o.obs}</span>` : ''}
      <span>🚚 ${o.delivery === 'delivery' ? 'Delivery' : 'Retirada no local'}</span>
    </div>`;
  document.getElementById('ord-detail-content').innerHTML = content;
  const btn = document.getElementById('ord-repeat-btn');
  btn.onclick = () => { repeatOrder(id); document.getElementById('ord-detail-modal').classList.remove('open'); };
  document.getElementById('ord-detail-modal').classList.add('open');
}

// ── REPETIR PEDIDO ───────────────────
function repeatOrder(id) {
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;
  o.items.forEach(item => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) existing.qty += item.qty;
    else cart.push({ ...item });
  });
  renderCart();
  toast('🔄 ' + o.items.length + ' item(ns) adicionado(s) ao carrinho!');
  // Abre o carrinho
  document.getElementById('cart-ov').classList.add('open');
}

// ── SALVAR ENDEREÇO ───────────────────
function saveAddr2() {
  if (!CU) return;
  CU.address = {
    cep:    document.getElementById('a-cep').value,
    bairro: document.getElementById('a-bairro').value,
    rua:    document.getElementById('a-rua').value,
    num:    document.getElementById('a-num').value,
    comp:   document.getElementById('a-comp').value,
    ref:    document.getElementById('a-ref').value,
  };
  if (CU.address.rua && CU.address.num) showAddrMap(CU.address);
  toast('✅ Endereço salvo!');
}

function showAddrMap(a) {
  const mapCard = document.getElementById('addr-map-card');
  const frame   = document.getElementById('addr-map-frame');
  if (!mapCard || !frame) return;
  const q = encodeURIComponent(`${a.rua}, ${a.num}, ${a.bairro}, Aracaju, SE, Brasil`);
  frame.src = `https://www.google.com/maps?q=${q}&output=embed`;
  mapCard.style.display = 'block';
}

// ── SALVAR CONTA ──────────────────────
function saveAcct() {
  if (!CU) return;
  CU.name  = document.getElementById('ac-name').value.trim()  || CU.name;
  CU.last  = document.getElementById('ac-last').value.trim();
  CU.phone = document.getElementById('ac-phone').value.trim();
  CU.birth = document.getElementById('ac-birth').value;
  // Atualiza header avatar iniciais e nome
  const ini = (CU.name[0] + (CU.last ? CU.last[0] : CU.name[1] || '')).toUpperCase();
  const iniEl = document.getElementById('pav-ini');
  if (iniEl) iniEl.textContent = ini;
  document.getElementById('p-name-big').textContent = CU.name + ' ' + (CU.last || '');
  updateNav(); toast('✅ Informações atualizadas!');
}

// ── FOTO DE PERFIL ────────────────────
function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { toast('⚠️ Arquivo muito grande (máx. 5 MB)'); return; }
  const reader = new FileReader();
  reader.onload = e => applyAvatar(e.target.result);
  reader.readAsDataURL(file);
}
function applyAvatar(dataUrl) {
  if (!CU) return;
  localStorage.setItem('diana_avatar_' + CU.id, dataUrl);
  // Atualiza avatar no header
  const img = document.getElementById('pav-img');
  const iniEl = document.getElementById('pav-ini');
  if (img) { img.src = dataUrl; img.style.display = 'block'; }
  if (iniEl) iniEl.style.display = 'none';
  // Atualiza strip de prévia
  const strip = document.getElementById('avatar-preview-strip');
  const stripImg = document.getElementById('avatar-strip-img');
  const stripName = document.getElementById('avatar-strip-name');
  if (strip) strip.style.display = 'flex';
  if (stripImg) stripImg.src = dataUrl;
  if (stripName) stripName.textContent = CU.name + ' ' + (CU.last || '');
  // Atualiza nav
  updateNav();
  toast('✅ Foto de perfil atualizada!');
}
function removeAvatar() {
  if (!CU) return;
  localStorage.removeItem('diana_avatar_' + CU.id);
  const img = document.getElementById('pav-img');
  const iniEl = document.getElementById('pav-ini');
  if (img) { img.src = ''; img.style.display = 'none'; }
  if (iniEl) {
    const ini = (CU.name[0] + (CU.last ? CU.last[0] : CU.name[1] || '')).toUpperCase();
    iniEl.textContent = ini; iniEl.style.display = 'block';
  }
  const strip = document.getElementById('avatar-preview-strip');
  if (strip) strip.style.display = 'none';
  updateNav();
  toast('🗑️ Foto removida!');
}
function renderAvatarTab() {
  if (!CU) return;
  const savedAvatar = localStorage.getItem('diana_avatar_' + CU.id);
  const strip = document.getElementById('avatar-preview-strip');
  const stripImg = document.getElementById('avatar-strip-img');
  const stripName = document.getElementById('avatar-strip-name');
  if (savedAvatar && strip) {
    strip.style.display = 'flex';
    if (stripImg) stripImg.src = savedAvatar;
    if (stripName) stripName.textContent = CU.name + ' ' + (CU.last || '');
  } else if (strip) {
    strip.style.display = 'none';
  }
}
function avatarDragOver(e) { e.preventDefault(); document.getElementById('avatar-drop-zone').classList.add('drag-over'); }
function avatarDragLeave(e) { document.getElementById('avatar-drop-zone').classList.remove('drag-over'); }
function avatarDrop(e) {
  e.preventDefault();
  document.getElementById('avatar-drop-zone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) { toast('⚠️ Envie uma imagem (JPG, PNG, WEBP)'); return; }
  if (file.size > 5 * 1024 * 1024) { toast('⚠️ Arquivo muito grande (máx. 5 MB)'); return; }
  const reader = new FileReader();
  reader.onload = ev => applyAvatar(ev.target.result);
  reader.readAsDataURL(file);
}

// ── FORÇA DA SENHA ────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const p1 = document.getElementById('ac-p1');
  if (p1) p1.addEventListener('input', () => {
    const v = p1.value;
    const fill = document.getElementById('pass-strength-fill');
    const lbl  = document.getElementById('pass-strength-label');
    if (!fill || !lbl) return;
    let score = 0;
    if (v.length >= 6)  score++;
    if (v.length >= 10) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const cfg = [
      { w:'0%',   c:'var(--border)',  t:'' },
      { w:'20%',  c:'#e05555',        t:'Muito fraca' },
      { w:'40%',  c:'#e05555',        t:'Fraca' },
      { w:'60%',  c:'#f0a500',        t:'Razoável' },
      { w:'80%',  c:'#3dba6e',        t:'Boa' },
      { w:'100%', c:'#2d7a4a',        t:'Muito forte 💪' },
    ][score];
    fill.style.width = cfg.w; fill.style.background = cfg.c;
    lbl.textContent = cfg.t;
  });
});

// ── MÁSCARAS DE INPUT ─────────────────
function maskCep(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 8);
  el.value = v.length > 5 ? v.slice(0,5) + '-' + v.slice(5) : v;
}
function maskPhone(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
  else if (v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
  el.value = v;
}
function maskCard(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 16);
  el.value = v.replace(/(.{4})/g, '$1 ').trim();
}
function maskExp(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 4);
  el.value = v.length > 2 ? v.slice(0,2) + '/' + v.slice(2) : v;
}

// updateNav atualizado para mostrar avatar real
const _origUpdateNav = updateNav;
function updateNav() {
  const el = document.getElementById('nav-auth');
  if (el) {
    if (CU) {
      const savedAvatar = localStorage.getItem('diana_avatar_' + CU.id);
      const ini = (CU.name[0] + (CU.last ? CU.last[0] : CU.name[1] || '')).toUpperCase();
      const avatarHTML = savedAvatar
        ? `<img src="${savedAvatar}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0">`
        : `<div class="avatar">${ini}</div>`;
      el.innerHTML = `<div class="user-pill" onclick="showUserProfile()">
        ${avatarHTML}${CU.name}</div>`;
    } else {
      el.innerHTML = `<button class="btn btn-ghost btn-sm" onclick="openAuth('login')">Entrar</button>
        <button class="btn btn-primary btn-sm" onclick="openAuth('reg')">Cadastrar</button>`;
    }
  }
  const ab = document.getElementById('admin-btn');
  if (ab) ab.style.display = isStaff() ? 'inline-flex' : 'none';
}

// ── BUSCA CEP (ViaCEP) ────────────────
async function buscaCepPerfil(el) {
  const cep = el.value.replace(/\D/g, '');
  if (cep.length !== 8) return;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d = await r.json();
    if (d.erro) { toast('⚠️ CEP não encontrado'); return; }
    if (d.logradouro) document.getElementById('a-rua').value    = d.logradouro;
    if (d.bairro)     document.getElementById('a-bairro').value = d.bairro;
    toast('📍 Endereço encontrado pelo CEP!');
  } catch { /* sem internet, silencia */ }
}
