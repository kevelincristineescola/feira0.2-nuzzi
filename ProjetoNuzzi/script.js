/* =====================================================================
   FEIRA NUZZI — FRONT-END CLIENTE
   ===================================================================== */

const STALLS = [
    {
        id: 1,
        name: "Barraca do Seu Nino",
        category: "Frutas & Verduras",
        owner: "Antônio 'Nino' Ferreira",
        desc: "Produtos direto da roça, colhidos na véspera da feira.",
        about: "Há 22 anos na mesma esquina da feira, o Seu Nino traz frutas e verduras cultivadas em sua própria chácara. A seleção muda com a estação.",
        cover: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1000&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1000&q=80",
            "https://images.unsplash.com/photo-1506484381205-f7945653044d?w=600&q=80",
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80"
        ],
        address: "Rua das Palmeiras, esquina com Av. Central — Banca 12",
        hours: "Sáb e Dom, 6h às 13h",
        products: [
            { name: "Manga Tommy", price: "R$ 6,90/kg", desc: "Doce e firme, colhida na semana.", img: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80" },
            { name: "Alface crespa", price: "R$ 3,50 un", desc: "Orgânica, sem agrotóxico.", img: "https://images.unsplash.com/photo-1622206151226-18ca2c9d680f?w=400&q=80" },
            { name: "Tomate italiano", price: "R$ 7,00/kg", desc: "Ideal para molhos caseiros.", img: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80" },
            { name: "Laranja pêra", price: "R$ 4,20/kg", desc: "Suco na hora, sem conservantes.", img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&q=80" }
        ]
    },
    {
        id: 2,
        name: "Tear & Fio Artesanatos",
        category: "Artesanato",
        owner: "Marli e Joaquina",
        desc: "Peças de crochê, cerâmica e madeira feitas à mão.",
        about: "Duas irmãs que transformaram a tradição da avó em ofício. Cada peça é única.",
        cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80",
            "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80",
            "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&q=80"
        ],
        address: "Alameda das Tipuanas, em frente ao coreto — Banca 27",
        hours: "Sáb e Dom, 8h às 17h",
        products: [
            { name: "Manta em crochê", price: "R$ 120,00", desc: "Lã mista, 1,40m x 1,80m.", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80" },
            { name: "Vaso de cerâmica", price: "R$ 65,00", desc: "Queima artesanal, acabamento fosco.", img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80" },
            { name: "Porta-copos madeira", price: "R$ 38,00 (jogo)", desc: "Madeira de reflorestamento.", img: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400&q=80" }
        ]
    },
    {
        id: 3,
        name: "Pastel da Dona Célia",
        category: "Comidas & Lanches",
        owner: "Célia Ramos",
        desc: "Pastéis fritos na hora, receita de família desde 1998.",
        about: "A fila mais famosa da feira. Dona Célia frita cada pastel na hora do pedido.",
        cover: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1000&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1000&q=80",
            "https://images.unsplash.com/photo-1626804475297-411e58b23e35?w=600&q=80",
            "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&q=80"
        ],
        address: "Rua das Palmeiras, próximo ao estacionamento — Banca 3",
        hours: "Sáb e Dom, 9h às 15h",
        products: [
            { name: "Pastel de carne", price: "R$ 12,00", desc: "Recheio generoso, massa crocante.", img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
            { name: "Pastel de queijo", price: "R$ 11,00", desc: "Queijo derretido na medida certa.", img: "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=400&q=80" },
            { name: "Caldo de cana", price: "R$ 6,00", desc: "Extraído na hora, com limão.", img: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80" }
        ]
    },
    {
        id: 4,
        name: "Flores do Vale",
        category: "Flores & Plantas",
        owner: "Rogério Andrade",
        desc: "Mudas, flores de corte e temperos frescos.",
        about: "Especializado em plantas ornamentais e temperos vivos.",
        cover: "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=1000&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=1000&q=80",
            "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80",
            "https://images.unsplash.com/photo-1462530260150-162092dbf011?w=600&q=80"
        ],
        address: "Alameda das Tipuanas, canto sul — Banca 34",
        hours: "Sáb e Dom, 7h às 14h",
        products: [
            { name: "Muda de manjericão", price: "R$ 9,00", desc: "Vaso de 10cm, pronto pra colher.", img: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&q=80" },
            { name: "Buquê de girassóis", price: "R$ 35,00", desc: "7 hastes, embrulho em kraft.", img: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80" },
            { name: "Suculenta mix", price: "R$ 14,00 un", desc: "Variedades sortidas, vaso de barro.", img: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&q=80" }
        ]
    },
    {
        id: 5,
        name: "Queijos Serra Alta",
        category: "Laticínios",
        owner: "Família Bianchi",
        desc: "Queijos e embutidos de produção própria, direto da serra.",
        about: "A família Bianchi produz queijos artesanais há três gerações.",
        cover: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1000&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1000&q=80",
            "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80",
            "https://images.unsplash.com/photo-1573528839172-7f4dfbcbd88a?w=600&q=80"
        ],
        address: "Rua das Palmeiras, em frente à igreja — Banca 18",
        hours: "Sáb e Dom, 6h às 13h",
        products: [
            { name: "Queijo colonial", price: "R$ 42,00/kg", desc: "Maturação de 20 dias, sabor suave.", img: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80" },
            { name: "Salame artesanal", price: "R$ 55,00/kg", desc: "Defumado em fumeiro próprio.", img: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&q=80" },
            { name: "Manteiga da roça", price: "R$ 18,00 (200g)", desc: "Batida fresca, sem conservantes.", img: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80" }
        ]
    },
    {
        id: 6,
        name: "Panificadora do Zé",
        category: "Padaria",
        owner: "José Martins",
        desc: "Pães, bolos e broas assados no forno a lenha.",
        about: "O forno a lenha do Zé fica ligado desde as 4h da manhã.",
        cover: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&q=80",
            "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
            "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&q=80"
        ],
        address: "Av. Central, entrada principal da feira — Banca 1",
        hours: "Sáb e Dom, 6h às 12h",
        products: [
            { name: "Pão fermentação natural", price: "R$ 22,00", desc: "Casca crocante, miolo alveolado.", img: "https://images.unsplash.com/photo-1585478259715-4d3a5f437075?w=400&q=80" },
            { name: "Broa de fubá", price: "R$ 9,00", desc: "Receita de forno a lenha.", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80" },
            { name: "Bolo de fubá cremoso", price: "R$ 28,00", desc: "Fatia generosa, cobertura de queijo.", img: "https://images.unsplash.com/photo-1519869325930-281384150729?w=400&q=80" }
        ]
    }
];

function registerVisit(id) {
    fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stallId: id }),
    }).catch(() => { });
}

const HIDDEN_CATS = ["Frutas & Verduras", "Artesanato", "Flores & Plantas", "Laticínios"];

function getCategories() {
    return ["Todas", ...new Set(STALLS.map(s => s.category).filter(c => !HIDDEN_CATS.includes(c)))];
}

const filtersEl = document.getElementById("filters");
const gridEl = document.getElementById("grid");
const overlay = document.getElementById("overlay");
const panel = document.getElementById("panel");
const searchInput = document.getElementById("searchInput");

let activeCat = "Todas";
let searchTerm = "";

function renderFilters() {
    const categories = getCategories();
    filtersEl.innerHTML = categories.map(c =>
        `<button data-cat="${c}" class="${c === activeCat ? 'active' : ''}">${c}</button>`
    ).join('');
    filtersEl.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            activeCat = btn.dataset.cat;
            renderFilters();
            renderGrid();
        });
    });
}

function renderGrid() {
    let list = activeCat === "Todas" ? STALLS : STALLS.filter(s => s.category === activeCat);
    const term = searchTerm.trim().toLowerCase();
    if (term) {
        list = list.filter(s =>
            s.name.toLowerCase().includes(term) ||
            s.category.toLowerCase().includes(term) ||
            s.desc.toLowerCase().includes(term) ||
            s.products.some(p => p.name.toLowerCase().includes(term))
        );
    }
    if (list.length === 0) {
        gridEl.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:40px 0; color:#6b5f4d;">Nenhuma barraca encontrada.</p>`;
        return;
    }
    gridEl.innerHTML = list.map(s => `
        <div class="stall-card" data-id="${s.id}">
            <span class="tag">${s.category}</span>
            <img src="${s.cover}" alt="${s.name}">
            <div class="body">
                <h3>${s.name}</h3>
                <div class="loc">📍 ${s.address.split('—')[0].trim()}</div>
                <div class="desc">${s.desc}</div>
                <div class="more">Saiba mais →</div>
            </div>
        </div>
    `).join('');
    gridEl.querySelectorAll('.stall-card').forEach(card => {
        card.addEventListener('click', () => openStall(Number(card.dataset.id)));
    });
}

function openStall(id) {
    const s = STALLS.find(x => x.id === id);
    if (!s) return;
    registerVisit(id);
    panel.innerHTML = `
        <div class="panel-head">
            <button class="close" id="closeBtn">✕</button>
            <div class="gallery">
                <img src="${s.gallery[0]}" alt="${s.name}">
                <div class="side">
                    <img src="${s.gallery[1]}" alt="${s.name} detalhe 1">
                    <img src="${s.gallery[2]}" alt="${s.name} detalhe 2">
                </div>
            </div>
        </div>
        <div class="panel-body">
            <span class="tag">${s.category}</span>
            <h2>${s.name}</h2>
            <div class="owner">por ${s.owner}</div>
            <p class="about">${s.about}</p>

            <div class="loc-block">
                <div class="pin">📍</div>
                <div class="info">
                    <b>${s.address}</b>
                    <span>Localização dentro da feira</span>
                    <div class="hours">🕒 ${s.hours}</div>
                </div>
            </div>

            <div class="section-label">Produtos</div>
            <div class="products">
                ${s.products.map((p, i) => `
                    <div class="product">
                        <img src="${p.img}" alt="${p.name}">
                        <div class="pbody">
                            <h4>${p.name}</h4>
                            <div class="price">${p.price}</div>
                            <p>${p.desc}</p>
                            <button class="product-add" data-stall="${s.id}" data-idx="${i}">+ Adicionar ao carrinho</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    overlay.classList.add('open');
    document.getElementById('closeBtn').addEventListener('click', closeStall);
    panel.querySelectorAll('.product-add').forEach(btn => {
        btn.addEventListener('click', () => {
            const stallId = Number(btn.getAttribute('data-stall'));
            const idx = parseInt(btn.getAttribute('data-idx'), 10);
            if (!requireLoginForCartAction({ type: "add-to-cart", stallId, idx })) return;
            addToCart(stallId, idx);
            btn.textContent = '✓ Adicionado';
            btn.classList.add('added');
            setTimeout(() => {
                btn.textContent = '+ Adicionar ao carrinho';
                btn.classList.remove('added');
            }, 1200);
        });
    });
    document.body.style.overflow = 'hidden';
}

function closeStall() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

overlay.addEventListener('click', (e) => { if (e.target === overlay) closeStall(); });

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeStall();
        closeCart();
        closeConfirm();
        closeTicket();
    }
});

searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderGrid();
});

async function refreshVendorStalls() {
    for (let i = STALLS.length - 1; i >= 0; i--) {
        if (STALLS[i]._vendorEmail) STALLS.splice(i, 1);
    }
    try {
        const r = await fetch("/api/stalls", { credentials: "include" });
        if (!r.ok) return;
        const lista = await r.json();
        lista.forEach(s => STALLS.push(s));
    } catch (e) {
        console.warn("Falha ao carregar barracas dos vendedores:", e);
    }
}

function getCart() {
    try { return JSON.parse(localStorage.getItem('feira_cart') || '[]'); }
    catch (e) { return []; }
}
function saveCart(cart) {
    localStorage.setItem('feira_cart', JSON.stringify(cart));
    updateCartBadge();
}
function parsePrice(priceStr) {
    const match = String(priceStr).match(/[\d.,]+/);
    if (!match) return 0;
    return parseFloat(match[0].replace(/\./g, '').replace(',', '.')) || 0;
}
function formatBRL(value) {
    return 'R$ ' + Number(value).toFixed(2).replace('.', ',');
}

function addToCart(stallId, productIdx) {
    const stall = STALLS.find(s => s.id === stallId);
    if (!stall) return;
    const product = stall.products[productIdx];
    if (!product) return;

    const cart = getCart();
    const key = `${stallId}__${productIdx}`;
    const existing = cart.find(item => item.key === key);

    if (existing) {
        existing.qty += 1;
        if (!existing.vendorEmail && stall._vendorEmail) {
            existing.vendorEmail = stall._vendorEmail;
        }
    } else {
        cart.push({
            key,
            stallId,
            stallName: stall.name,
            stallAddress: stall.address,
            vendorEmail: stall._vendorEmail || null,
            name: product.name,
            price: product.price,
            img: product.img,
            qty: 1
        });
    }
    saveCart(cart);
}
function updateCartQty(key, delta) {
    let cart = getCart();
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
    saveCart(cart);
    renderCartPanel();
}
function cartTotal(cart) {
    return cart.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
}
function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    if (count > 0) {
        badge.style.display = 'flex';
        badge.textContent = count;
    } else {
        badge.style.display = 'none';
    }
}

const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartContent = document.getElementById('cartContent');

function openCart() {
    renderCartPanel();
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeCart() {
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}
cartBtn.addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', (e) => { if (e.target === cartOverlay) closeCart(); });

function renderCartPanel() {
    const cart = getCart();
    if (cart.length === 0) {
        cartContent.innerHTML = `<div class="cart-empty">Seu carrinho está vazio.<br>Adicione produtos das barraquinhas!</div>`;
        return;
    }
    const total = cartTotal(cart);
    const semVendedor = cart.filter(i => !i.vendorEmail);

    let aviso = '';
    if (semVendedor.length > 0) {
        aviso = `<div class="cart-warning">⚠️ ${semVendedor.length} item(ns) de barracas de exemplo não serão enviados ao servidor.</div>`;
    }

    cartContent.innerHTML = `
        ${aviso}
        ${cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="info">
                    <div class="name">${item.name}</div>
                    <div class="stall">${item.stallName}</div>
                    <div class="price">${item.price}</div>
                </div>
                <div class="qty-controls">
                    <button data-action="dec" data-key="${item.key}">−</button>
                    <span>${item.qty}</span>
                    <button data-action="inc" data-key="${item.key}">+</button>
                </div>
            </div>
        `).join('')}
        <div class="cart-total">
            <span>Total estimado</span>
            <span>${formatBRL(total)}</span>
        </div>
        <button class="cart-checkout" id="checkoutBtn">Revisar pedido</button>
    `;
    cartContent.querySelectorAll('[data-action="inc"]').forEach(btn => {
        btn.addEventListener('click', () => updateCartQty(btn.getAttribute('data-key'), 1));
    });
    cartContent.querySelectorAll('[data-action="dec"]').forEach(btn => {
        btn.addEventListener('click', () => updateCartQty(btn.getAttribute('data-key'), -1));
    });
    document.getElementById('checkoutBtn').addEventListener('click', openConfirm);
}

const confirmOverlay = document.getElementById('confirmOverlay');
const confirmPanel = document.getElementById('confirmPanel');

function groupCartByStall(cart) {
    const byStall = {};
    cart.forEach(item => {
        if (!byStall[item.stallId]) {
            byStall[item.stallId] = {
                name: item.stallName,
                address: item.stallAddress,
                vendorEmail: item.vendorEmail,
                items: []
            };
        }
        byStall[item.stallId].items.push(item);
    });
    return byStall;
}

function openConfirm() {
    const cart = getCart();
    if (cart.length === 0) return;

    const byStall = groupCartByStall(cart);
    const total = cartTotal(cart);

    confirmPanel.innerHTML = `
        <button class="close" id="confirmClose">✕</button>
        <h2>Confira sua reserva</h2>
        <p class="sub">Verifique os itens e as barraquinhas antes de confirmar.</p>
        ${Object.values(byStall).map(stall => `
            <div class="confirm-stall">
                <div class="stall-name">📍 ${stall.name}</div>
                ${stall.items.map(item => `
                    <div class="citem">
                        <span>${item.qty}x ${item.name}</span>
                        <span>${item.price}</span>
                    </div>
                `).join('')}
            </div>
        `).join('')}
        <div class="confirm-total">
            <span>Valor estimado dos itens</span>
            <span>${formatBRL(total)}</span>
        </div>
        <label class="confirm-check">
            <input type="checkbox" id="confirmCheck">
            <span>Confirmo que revisei os itens, as quantidades e as barraquinhas de retirada acima e desejo finalizar a reserva.</span>
        </label>
        <div class="confirm-actions">
            <button class="confirm-back" id="confirmBack">Voltar ao carrinho</button>
            <button class="confirm-final" id="confirmFinal" disabled>Confirmar reserva</button>
        </div>
    `;

    cartOverlay.classList.remove('open');
    confirmOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    const checkbox = document.getElementById('confirmCheck');
    const finalBtn = document.getElementById('confirmFinal');
    checkbox.addEventListener('change', () => { finalBtn.disabled = !checkbox.checked; });

    document.getElementById('confirmClose').addEventListener('click', closeConfirm);
    document.getElementById('confirmBack').addEventListener('click', () => {
        closeConfirm();
        openCart();
    });
    finalBtn.addEventListener('click', () => {
        if (!checkbox.checked) return;
        finalizeOrder();
    });
}
function closeConfirm() {
    confirmOverlay.classList.remove('open');
    document.body.style.overflow = '';
}
confirmOverlay.addEventListener('click', (e) => { if (e.target === confirmOverlay) closeConfirm(); });

const ticketOverlay = document.getElementById('ticketOverlay');
const ticketPanel = document.getElementById('ticketPanel');

async function finalizeOrder() {
    const cart = getCart();
    if (cart.length === 0) return;

    const byStall = groupCartByStall(cart);
    const reservationId = '#' + Math.floor(100000 + Math.random() * 900000);
    const total = cartTotal(cart);

    ticketPanel.innerHTML = `
        <button class="close" id="ticketClose">✕</button>
        <div class="ticket-head">
            <span class="stamp">Reserva confirmada</span>
            <h2>Seu ticket de retirada</h2>
            <div class="order-id">Reserva ${reservationId}</div>
        </div>
        ${Object.values(byStall).map(stall => `
            <div class="ticket-stall">
                <div class="stall-name">📍 ${stall.name}</div>
                <div class="stall-addr">${stall.address}</div>
                ${stall.items.map(item => `
                    <div class="titem">
                        <span>${item.qty}x ${item.name}</span>
                        <span>${item.price}</span>
                    </div>
                `).join('')}
            </div>
        `).join('')}
        <div class="ticket-foot">
            <span>Total estimado</span>
            <span>${formatBRL(total)}</span>
        </div>
        <div class="ticket-note">Mostre este ticket em cada barraquinha listada acima para retirar os itens reservados. Bom passeio pela feira! 🧺</div>
    `;

    const resultado = await enviarPedidosParaVendedores(byStall, reservationId);

    if (resultado && resultado.ok === false) {
        closeConfirm();
        return;
    }

    saveCart([]);
    closeConfirm();
    ticketOverlay.classList.add('open');
    document.getElementById('ticketClose').addEventListener('click', closeTicket);
}
function closeTicket() {
    ticketOverlay.classList.remove('open');
    document.body.style.overflow = '';
}
ticketOverlay.addEventListener('click', (e) => { if (e.target === ticketOverlay) closeTicket(); });

async function enviarPedidosParaVendedores(byStall, reservaId) {
    const stalls = [];
    Object.values(byStall).forEach(stall => {
        if (!stall.vendorEmail) {
            console.warn("[carrinho] item sem vendorEmail, ignorado:", stall.name);
            return;
        }
        const valorNum = stall.items.reduce(
            (soma, item) => soma + parsePrice(item.price) * item.qty, 0
        );
        stalls.push({
            vendorEmail: stall.vendorEmail,
            items: stall.items.map(i => ({
                name: i.name, price: i.price, qty: i.qty,
            })),
            valor: formatBRL(valorNum),
            valorNumerico: valorNum,
        });
    });

    if (!stalls.length) {
        console.warn("[carrinho] nenhum pedido para enviar.");
        return { ok: true, pedidos: [], ignorados: ["sem vendorEmail"] };
    }

    try {
        const r = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ reservaId, stalls }),
        });

        const body = await r.json().catch(() => ({}));

        if (!r.ok) {
            console.error("[carrinho] servidor recusou:", r.status, body);
            alert("Não foi possível registrar o pedido. " + (body.erro || `HTTP ${r.status}`));
            return { ok: false, status: r.status, erro: body.erro };
        }

        console.log("[carrinho] pedidos enviados:", body);
        return body;
    } catch (e) {
        console.error("[carrinho] falha de rede:", e);
        alert("Falha de rede ao enviar o pedido. Tente novamente.");
        return { ok: false, erro: String(e) };
    }
}

let _cachedSession = null;
function readSession() { return _cachedSession; }
function clearSession() { _cachedSession = null; }

async function fetchSession() {
    try {
        const r = await fetch("/api/auth/session", { credentials: "include" });
        _cachedSession = await r.json();
    } catch (e) { _cachedSession = null; }
    return _cachedSession;
}

let pendingAction = null;

function showCatalog() {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("loginNote").classList.remove("show");
    document.getElementById("app-cliente").style.display = "block";
    refreshVendorStalls().then(() => {
        renderFilters();
        renderGrid();
    });
}

function showLogin(reason) {
    document.getElementById("loginScreen").classList.remove("hidden");
    const note = document.getElementById("loginNote");
    if (reason === "checkout" || reason === "add-to-cart") {
        note.textContent = reason === "checkout"
            ? "Faça login (ou crie sua conta) pra finalizar a reserva."
            : "Faça login (ou crie sua conta) pra adicionar itens ao carrinho.";
        note.classList.add("show");
    } else {
        note.classList.remove("show");
    }
}

function requireLoginForOrder() {
    if (_cachedSession && _cachedSession.type === "cliente") return true;
    pendingAction = { type: "checkout" };
    if (cartOverlay) cartOverlay.classList.remove("open");
    showLogin("checkout");
    return false;
}

function requireLoginForCartAction(action) {
    if (_cachedSession && _cachedSession.type === "cliente") return true;
    pendingAction = action;
    showLogin("add-to-cart");
    return false;
}

function resumePendingAction() {
    if (!pendingAction) return;
    const action = pendingAction;
    pendingAction = null;
    if (!_cachedSession || _cachedSession.type !== "cliente") return;
    if (action.type === "checkout") {
        openConfirm();
    } else if (action.type === "add-to-cart") {
        addToCart(action.stallId, action.idx);
        openCart();
    }
}

document.getElementById("openLoginBtn").addEventListener("click", () => showLogin());
document.getElementById("backToCatalogBtn").addEventListener("click", () => {
    pendingAction = null;
    showCatalog();
});

document.addEventListener("click", (e) => {
    const btn = e.target.closest("#checkoutBtn");
    if (!btn) return;
    if (!requireLoginForOrder()) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
}, true);

function injectLogoutControls(type, name) {
    document.querySelectorAll(".feira-logout-btn").forEach(b => b.remove());
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "feira-logout-btn";
    btn.textContent = "Sair (" + (name || "").split(" ")[0] + ")";
    btn.addEventListener("click", doLogout);
    const actions = document.querySelector("#app-cliente .header-actions");
    if (actions) actions.appendChild(btn);
}

async function doLogout() {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch (e) { }
    clearSession();
    document.querySelectorAll(".feira-logout-btn").forEach(b => b.remove());
    document.getElementById("loginForm").reset();
    document.getElementById("registerForm").reset();
    showCatalog();
}

async function enterApp(type, name, email, extra) {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("loginNote").classList.remove("show");

    if (type === "vendedor") {
        window.location.href = "/parceiro.html";
        return;
    }
    if (type === "adm") {
        window.location.href = "/admin.html";
        return;
    }

    document.getElementById("app-cliente").style.display = "block";
    await refreshVendorStalls();
    renderFilters();
    renderGrid();
    injectLogoutControls(type, name);
    resumePendingAction();
}

const tabLoginBtn = document.getElementById("tabLoginBtn");
const tabRegisterBtn = document.getElementById("tabRegisterBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const lpTitle = document.getElementById("lpTitle");
const lpSub = document.getElementById("lpSub");

tabLoginBtn.addEventListener("click", () => {
    tabLoginBtn.classList.add("active");
    tabRegisterBtn.classList.remove("active");
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    lpTitle.textContent = "Entrar";
    lpSub.textContent = "Acesse com o mesmo login, cliente ou vendedor.";
});
tabRegisterBtn.addEventListener("click", () => {
    tabRegisterBtn.classList.add("active");
    tabLoginBtn.classList.remove("active");
    registerForm.style.display = "block";
    loginForm.style.display = "none";
    lpTitle.textContent = "Criar conta";
    lpSub.textContent = "Crie sua conta de cliente pra reservar produtos na feira.";
});

document.querySelectorAll(".toggle-eye").forEach(btn => {
    btn.addEventListener("click", () => {
        const target = document.getElementById(btn.dataset.target);
        const use = btn.querySelector("use");
        const showing = target.type === "password";
        target.type = showing ? "text" : "password";
        use.setAttribute("href", showing ? "#i-eye-off" : "#i-eye");
    });
});

document.getElementById("forgotBtn").addEventListener("click", () => {
    const msg = document.getElementById("forgotMsg");
    msg.classList.add("show");
    setTimeout(() => msg.classList.remove("show"), 4000);
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const pass = document.getElementById("loginPass").value;
    const errorEl = document.getElementById("loginError");

    try {
        const r = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, senha: pass }),
        });
        if (!r.ok) {
            errorEl.classList.add("show");
            return;
        }
        errorEl.classList.remove("show");
        _cachedSession = await r.json();
        enterApp(_cachedSession.type, _cachedSession.name, _cachedSession.email);
    } catch (err) {
        errorEl.classList.add("show");
    }
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const senha = document.getElementById("regPass").value;
    const errorEl = document.getElementById("registerError");

    try {
        const r = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ nome, email, senha }),
        });
        const body = await r.json();
        if (!r.ok) {
            errorEl.textContent = body.erro || "Erro ao cadastrar.";
            errorEl.classList.add("show");
            return;
        }
        errorEl.classList.remove("show");
        _cachedSession = body;
        enterApp("cliente", body.name, body.email);
    } catch (err) {
        errorEl.textContent = "Falha de rede.";
        errorEl.classList.add("show");
    }
});

(async function init() {
    updateCartBadge();
    await refreshVendorStalls();
    renderFilters();
    renderGrid();

    await fetchSession();
    if (_cachedSession && _cachedSession.type) {
        if (_cachedSession.type === "vendedor") {
            window.location.href = "/parceiro.html";
            return;
        }
        if (_cachedSession.type === "adm") {
            window.location.href = "/admin.html";
            return;
        }
        document.getElementById("app-cliente").style.display = "block";
        injectLogoutControls(_cachedSession.type, _cachedSession.name);
        resumePendingAction();
    } else {
        showCatalog();
    }
})();