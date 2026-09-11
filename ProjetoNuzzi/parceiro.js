/* =====================================================================
   FEIRA NUZZI — PORTAL DO PARCEIRO
   ===================================================================== */

const FALLBACK_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80";

const VIEW_META = {
  pedidos: { title: "Pedidos de hoje", sub: "Marque as retiradas e acompanhe o movimento da banca." },
  produtos: { title: "Seus produtos", sub: "Cadastre, edite preços ou pause itens do cardápio." },
  perfil: { title: "Minha barraca", sub: "Essas informações aparecem para quem visita sua página na feira." }
};

let loja = { nome: "", categoria: "", descricao: "", tempo: "", horario: "", logo: "", banner: "", aberta: false };
let produtos = [];
let pedidos = [];
let currentView = "pedidos";
let orderFilter = "pendente";
let orderQuery = "";
let productFilter = "todos";
let productQuery = "";

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function safeImg(url) {
  try {
    const u = new URL(url);
    if (u.protocol === "http:" || u.protocol === "https:") return u.href;
  } catch (e) { }
  return FALLBACK_IMG;
}
function parsePrice(str) {
  const m = String(str || "").match(/[\d.,]+/);
  if (!m) return 0;
  return parseFloat(m[0].replace(/\./g, "").replace(",", ".")) || 0;
}
function formatBRL(v) { return "R$ " + Number(v).toFixed(2).replace(".", ","); }
function isValidPrice(str) {
  return /^R\$\s?\d{1,3}(\.\d{3})*(,\d{2})?\s?(\/\s?\w+)?$/.test(String(str || "").trim());
}
function showToast(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2200);
}

const loginForm = document.getElementById("loginForm");
const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");

document.querySelectorAll(".toggle-eye").forEach(btn => {
  btn.addEventListener("click", () => {
    const t = document.getElementById(btn.dataset.target);
    const use = btn.querySelector("use");
    const showing = t.type === "password";
    t.type = showing ? "text" : "password";
    use.setAttribute("href", showing ? "#i-eye-off" : "#i-eye");
  });
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const senha = document.getElementById("loginPass").value;
  const errEl = document.getElementById("loginError");

  try {
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, senha }),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) { errEl.classList.add("show"); return; }
    if (body.type !== "vendedor") {
      errEl.textContent = "Esta conta não é de vendedor.";
      errEl.classList.add("show");
      return;
    }
    errEl.classList.remove("show");
    enterApp(body.name);
  } catch (err) {
    errEl.textContent = "Falha de rede.";
    errEl.classList.add("show");
  }
});

async function checkSession() {
  try {
    const r = await fetch("/api/auth/session", { credentials: "include" });
    const s = await r.json();
    if (!s) { loginScreen.classList.remove("hidden"); return; }
    if (s.type === "vendedor") enterApp(s.name);
    else if (s.type === "adm") location.href = "/admin.html";
    else location.href = "/";
  } catch (e) {
    loginScreen.classList.remove("hidden");
  }
}

function enterApp(name) {
  loginScreen.classList.add("hidden");
  app.classList.add("open");

  const initial = (name || "P").trim().charAt(0).toUpperCase();
  document.getElementById("userChip").innerHTML = `
    <div class="avatar">${esc(initial)}</div>
    <span>${esc((name || "").split(" ")[0])}</span>
    <button type="button" id="logoutBtn">Sair</button>
  `;
  document.getElementById("logoutBtn").addEventListener("click", doLogout);
  document.getElementById("todayBadge").textContent = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long"
  });

  showView("pedidos");
  carregarTudo();
}

async function doLogout() {
  try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch (e) { }
  location.href = "/";
}

document.getElementById("navList").querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});
function showView(view) {
  currentView = view;
  document.querySelectorAll("#navList button").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + view).classList.add("active");
  document.getElementById("viewTitle").textContent = VIEW_META[view].title;
  document.getElementById("viewSub").textContent = VIEW_META[view].sub;
}

async function carregarTudo() {
  try {
    const r = await fetch("/api/vendor/data", { credentials: "include" });
    if (!r.ok) return;
    const dados = await r.json();
    loja = dados.loja || loja;
    produtos = dados.produtos || [];
    pedidos = dados.pedidos || [];
  } catch (e) { console.warn(e); }
  document.getElementById("stallHeadline").textContent =
    (loja.nome || "Sua barraca") + " — gerencie o dia da feira.";
  renderAll();
}

function renderAll() {
  renderCrates();
  renderOrders();
  renderProducts();
  renderProfile();
}

function renderCrates() {
  const pendentes = pedidos.filter(p => p.status === "pendente").length;
  const retirados = pedidos.filter(p => p.status === "concluido").length;
  const revenue = pedidos
    .filter(p => p.status !== "cancelado")
    .reduce((s, p) => s + (Number(p.valorNumerico) || 0), 0);
  const ativos = produtos.filter(p => p.disponivel).length;

  document.getElementById("crates").innerHTML = `
    <div class="crate"><div class="num accent">${pendentes}</div><div class="label">Pedidos pendentes</div></div>
    <div class="crate"><div class="num">${retirados}</div><div class="label">Já retirados</div></div>
    <div class="crate"><div class="num">${ativos}</div><div class="label">Produtos ativos</div></div>
    <div class="crate"><div class="num">${formatBRL(revenue)}</div><div class="label">Estimado no dia</div></div>
  `;
  const pb = document.getElementById("pendingBadge");
  pb.textContent = pendentes;
  pb.style.display = pendentes > 0 ? "inline-block" : "none";
  const pb2 = document.getElementById("productsBadge");
  pb2.textContent = produtos.length;
  pb2.style.display = produtos.length > 0 ? "inline-block" : "none";
}

document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    orderFilter = btn.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(b => b.classList.toggle("active", b === btn));
    renderOrders();
  });
});
document.getElementById("orderSearch").addEventListener("input", e => {
  orderQuery = e.target.value;
  renderOrders();
});

function renderOrders() {
  let list = pedidos.slice();
  if (orderFilter === "pendente") list = list.filter(p => p.status !== "concluido" && p.status !== "cancelado");
  if (orderFilter === "retirado") list = list.filter(p => p.status === "concluido");

  const q = orderQuery.trim().toLowerCase();
  if (q) {
    list = list.filter(p =>
      String(p.id).includes(q) ||
      (p.cliente || "").toLowerCase().includes(q) ||
      (p.itens || "").toLowerCase().includes(q)
    );
  }

  const el = document.getElementById("ordersList");
  if (!list.length) {
    el.innerHTML = `<div class="empty-box">Nenhum pedido nesta fila agora.</div>`;
    return;
  }
  el.innerHTML = list.map(p => {
    const done = p.status === "concluido";
    return `
      <div class="order-card ${done ? "done" : ""}">
        <div class="order-card-head">
          <div>
            <div class="oid">#${esc(p.id)}</div>
            <div class="obuyer">${esc(p.cliente)}</div>
          </div>
          <span class="status-pill ${done ? "is-done" : ""}">${done ? "Retirado" : (p.status || "pendente")}</span>
        </div>
        <div class="oitem"><span>${esc(p.itens)}</span><span>${esc(p.valor)}</span></div>
        <div class="order-total"><span>Total</span><span>${esc(p.valor)}</span></div>
        <button class="order-action ${done ? "is-done" : ""}" data-id="${p.id}">
          ${done ? "Desfazer retirada" : "Marcar como retirado"}
        </button>
      </div>`;
  }).join("");

  el.querySelectorAll(".order-action").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.id);
      const p = pedidos.find(x => x.id === id);
      if (!p) return;
      const novo = p.status === "concluido" ? "pendente" : "concluido";
      try {
        const r = await fetch(`/api/vendor/pedidos/${id}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: novo }),
        });
        if (!r.ok) throw new Error("fail");
        p.status = novo;
        renderOrders();
        renderCrates();
      } catch (e) { alert("Falha ao atualizar status."); }
    });
  });
}

document.querySelectorAll("[data-pfilter]").forEach(btn => {
  btn.addEventListener("click", () => {
    productFilter = btn.dataset.pfilter;
    document.querySelectorAll("[data-pfilter]").forEach(b => b.classList.toggle("active", b === btn));
    renderProducts();
  });
});
document.getElementById("productSearch").addEventListener("input", e => {
  productQuery = e.target.value;
  renderProducts();
});

function renderProducts() {
  const el = document.getElementById("productsList");
  if (!produtos.length) {
    el.innerHTML = `<div class="empty-box">Você ainda não cadastrou produtos. Use o formulário abaixo.</div>`;
    return;
  }
  let list = produtos.slice();
  if (productFilter === "ativo") list = list.filter(p => p.disponivel);
  if (productFilter === "pausado") list = list.filter(p => !p.disponivel);

  const q = productQuery.trim().toLowerCase();
  if (q) list = list.filter(p => p.nome.toLowerCase().includes(q) || (p.descricao || "").toLowerCase().includes(q));

  if (!list.length) {
    el.innerHTML = `<div class="empty-box">Nenhum produto encontrado com esse filtro.</div>`;
    return;
  }
  el.innerHTML = list.map(p => `
    <div class="prow">
      <img src="${esc(safeImg(p.imagem || FALLBACK_IMG))}" alt="${esc(p.nome)}" onerror="this.src='${FALLBACK_IMG}'">
      <div>
        <div class="pname">${esc(p.nome)}${p.disponivel ? "" : '<span class="off-tag">Pausado</span>'}</div>
        <div class="pdesc">${esc(p.descricao || "")}</div>
        <div class="pprice">${esc(p.preco)}</div>
      </div>
      <div class="prow-actions">
        <button class="icon-btn" data-toggle="${p.id}"><svg class="icon"><use href="#${p.disponivel ? "i-pause" : "i-play"}"/></svg></button>
        <button class="icon-btn" data-edit="${p.id}"><svg class="icon"><use href="#i-edit"/></svg></button>
        <button class="icon-btn danger" data-del="${p.id}"><svg class="icon"><use href="#i-close"/></svg></button>
      </div>
    </div>
  `).join("");

  el.querySelectorAll("[data-toggle]").forEach(btn => btn.addEventListener("click", async () => {
    const id = Number(btn.dataset.toggle);
    const p = produtos.find(x => x.id === id);
    if (!p) return;
    try {
      await fetch(`/api/vendor/produtos/${id}`, {
        method: "PUT", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponivel: !p.disponivel }),
      });
      p.disponivel = !p.disponivel;
      renderProducts(); renderCrates();
    } catch (e) { }
  }));

  el.querySelectorAll("[data-edit]").forEach(btn => btn.addEventListener("click", () => openEdit(Number(btn.dataset.edit))));
  el.querySelectorAll("[data-del]").forEach(btn => btn.addEventListener("click", async () => {
    const id = Number(btn.dataset.del);
    const p = produtos.find(x => x.id === id);
    if (!p || !confirm(`Remover "${p.nome}" do cardápio?`)) return;
    try {
      await fetch(`/api/vendor/produtos/${id}`, { method: "DELETE", credentials: "include" });
      produtos = produtos.filter(x => x.id !== id);
      renderProducts(); renderCrates();
    } catch (e) { }
  }));
}

document.getElementById("addProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("pName").value.trim();
  let preco = document.getElementById("pPrice").value.trim();
  if (!nome || !preco) return;
  if (!preco.toUpperCase().startsWith("R$")) preco = "R$ " + preco;
  if (!isValidPrice(preco)) {
    document.getElementById("pPriceError").classList.add("show");
    return;
  }
  document.getElementById("pPriceError").classList.remove("show");

  const payload = {
    nome,
    preco,
    descricao: document.getElementById("pDesc").value.trim(),
    imagem: document.getElementById("pImg").value.trim(),
    disponivel: true,
  };
  try {
    const r = await fetch("/api/vendor/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) { alert(body.erro || "Erro ao salvar."); return; }
    produtos.unshift({ id: body.id, ...payload });
    e.target.reset();
    renderProducts(); renderCrates();
    showToast("productToast", "Produto adicionado");
  } catch (err) { alert("Falha de rede."); }
});

function openEdit(id) {
  const p = produtos.find(x => x.id === id);
  if (!p) return;
  document.getElementById("editId").value = id;
  document.getElementById("eName").value = p.nome;
  document.getElementById("ePrice").value = p.preco;
  document.getElementById("eImg").value = p.imagem || "";
  document.getElementById("eDesc").value = p.descricao || "";
  document.getElementById("eActive").checked = p.disponivel;
  document.getElementById("editOverlay").classList.add("open");
}
function closeEdit() { document.getElementById("editOverlay").classList.remove("open"); }
document.getElementById("editClose").addEventListener("click", closeEdit);
document.getElementById("editCancel").addEventListener("click", closeEdit);
document.getElementById("editOverlay").addEventListener("click", e => {
  if (e.target.id === "editOverlay") closeEdit();
});

document.getElementById("editProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = Number(document.getElementById("editId").value);
  let preco = document.getElementById("ePrice").value.trim();
  if (!preco.toUpperCase().startsWith("R$")) preco = "R$ " + preco;
  if (!isValidPrice(preco)) {
    document.getElementById("ePriceError").classList.add("show");
    return;
  }
  document.getElementById("ePriceError").classList.remove("show");

  const payload = {
    nome: document.getElementById("eName").value.trim(),
    preco,
    imagem: document.getElementById("eImg").value.trim(),
    descricao: document.getElementById("eDesc").value.trim(),
    disponivel: document.getElementById("eActive").checked,
  };
  try {
    await fetch(`/api/vendor/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const p = produtos.find(x => x.id === id);
    Object.assign(p, payload);
    closeEdit();
    renderProducts();
    showToast("productToast", "Alterações salvas");
  } catch (err) { alert("Falha de rede."); }
});

function renderProfile() {
  document.getElementById("prName").value = loja.nome || "";
  document.getElementById("prCategory").value = loja.categoria || "Outros";
  document.getElementById("prAbout").value = loja.descricao || "";
  document.getElementById("prHours").value = loja.horario || "";
  document.getElementById("prOpen").checked = !!loja.aberta;
}

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    nome: document.getElementById("prName").value.trim(),
    categoria: document.getElementById("prCategory").value,
    descricao: document.getElementById("prAbout").value.trim(),
    horario: document.getElementById("prHours").value.trim(),
    aberta: document.getElementById("prOpen").checked,
  };
  try {
    const r = await fetch("/api/vendor/loja", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error();
    Object.assign(loja, payload);
    document.getElementById("stallHeadline").textContent =
      (loja.nome || "Sua barraca") + " — gerencie o dia da feira.";
    showToast("saveToast", "Salvo");
  } catch (err) { alert("Falha ao salvar."); }
});

checkSession();