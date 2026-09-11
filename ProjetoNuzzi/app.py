# -*- coding: utf-8 -*-
"""
===============================================================
 FEIRA NUZZI — BACK-END FLASK + SQLITE
===============================================================
 Serve o front + API REST. Persistência garantida.

 Rodar:
     pip install flask flask-cors
     python app.py

 Acessar:
     http://localhost:5000            → catálogo (cliente)
     http://localhost:5000/parceiro.html → portal do vendedor
     http://localhost:5000/admin.html    → painel admin

 Contas criadas automaticamente:
   cliente@feiranuzzi.com  / compras123   (cliente)
   nino@feiranuzzi.com     / colheita2024 (vendedor)
   admin@feiranuzzi.com    / admin123     (adm)
===============================================================
"""
import os
import sqlite3
from datetime import datetime
from functools import wraps
from pathlib import Path

from flask import (
    Flask, request, jsonify, g, session,
    send_from_directory, abort,
)
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash


# =====================================================================
# CONFIG
# =====================================================================
BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "feira.db"

app = Flask(__name__, static_folder=None)
app.secret_key = os.environ.get("FEIRA_SECRET") or "feira-nuzzi-chave-dev-fixa"
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    JSON_AS_ASCII=False,
)
CORS(app, supports_credentials=True)


# =====================================================================
# BANCO
# =====================================================================
def _raw_conn():
    conn = sqlite3.connect(
        DB_PATH,
        timeout=30.0,
        isolation_level="DEFERRED",
    )
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA synchronous = NORMAL")
    return conn


def get_conn():
    if "db" not in g:
        g.db = _raw_conn()
    return g.db


@app.teardown_appcontext
def _close_db(exc):
    db = g.pop("db", None)
    if db is not None:
        try:
            if exc is None:
                db.commit()
            else:
                db.rollback()
        finally:
            db.close()


def commit(conn):
    conn.commit()


# =====================================================================
# SCHEMA
# =====================================================================
SCHEMA = """
CREATE TABLE IF NOT EXISTS usuarios (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    senha_hash  TEXT NOT NULL,
    tipo        TEXT NOT NULL CHECK (tipo IN ('cliente','vendedor','adm')),
    criado_em   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lojas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id   INTEGER UNIQUE NOT NULL,
    nome         TEXT NOT NULL DEFAULT '',
    categoria    TEXT NOT NULL DEFAULT '',
    descricao    TEXT NOT NULL DEFAULT '',
    tempo        TEXT NOT NULL DEFAULT '',
    horario      TEXT NOT NULL DEFAULT '',
    logo         TEXT NOT NULL DEFAULT '',
    banner       TEXT NOT NULL DEFAULT '',
    aberta       INTEGER NOT NULL DEFAULT 0,
    atualizado_em TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS produtos (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    loja_id      INTEGER NOT NULL,
    nome         TEXT NOT NULL,
    descricao    TEXT NOT NULL DEFAULT '',
    preco        TEXT NOT NULL DEFAULT 'R$ 0,00',
    categoria    TEXT NOT NULL DEFAULT '',
    imagem       TEXT NOT NULL DEFAULT '',
    disponivel   INTEGER NOT NULL DEFAULT 1,
    estoque      INTEGER,
    criado_em    TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedidos (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    loja_id         INTEGER NOT NULL,
    cliente_id      INTEGER,
    cliente_nome    TEXT NOT NULL,
    reserva_id      TEXT,
    itens           TEXT NOT NULL,
    valor           TEXT NOT NULL,
    valor_numerico  REAL NOT NULL DEFAULT 0,
    hora            TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pendente'
                    CHECK (status IN ('pendente','preparo','pronto','concluido','cancelado')),
    criado_em       TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (loja_id)    REFERENCES lojas(id)    ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS visitas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    stall_id     INTEGER NOT NULL,
    visitado_em  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_prod_loja   ON produtos(loja_id);
CREATE INDEX IF NOT EXISTS idx_ped_loja    ON pedidos(loja_id);
CREATE INDEX IF NOT EXISTS idx_ped_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ped_status  ON pedidos(status);
"""


def init_db():
    conn = _raw_conn()
    try:
        conn.executescript(SCHEMA)
        conn.commit()
    finally:
        conn.close()


def seed_demo():
    conn = _raw_conn()
    try:
        demo = [
            ("Cliente Demo",  "cliente@feiranuzzi.com", "compras123",   "cliente"),
            ("Seu Nino",      "nino@feiranuzzi.com",    "colheita2024", "vendedor"),
            ("Administrador", "admin@feiranuzzi.com",   "admin123",     "adm"),
        ]
        for nome, email, senha, tipo in demo:
            if not conn.execute("SELECT 1 FROM usuarios WHERE email=?", (email,)).fetchone():
                conn.execute(
                    "INSERT INTO usuarios (nome,email,senha_hash,tipo) VALUES (?,?,?,?)",
                    (nome, email, generate_password_hash(senha), tipo),
                )
        row = conn.execute("SELECT id FROM usuarios WHERE email=?",
                           ("nino@feiranuzzi.com",)).fetchone()
        if row:
            uid = row["id"]
            if not conn.execute("SELECT 1 FROM lojas WHERE usuario_id=?", (uid,)).fetchone():
                conn.execute("""
                    INSERT INTO lojas (usuario_id, nome, categoria, descricao,
                                       horario, aberta)
                    VALUES (?,?,?,?,?,1)
                """, (uid, "Barraca do Seu Nino", "Frutas & Verduras",
                      "Produtos direto da roça.", "Sáb e Dom, 6h às 13h"))
            # produtos iniciais da loja do Nino
            loja = conn.execute("SELECT id FROM lojas WHERE usuario_id=?", (uid,)).fetchone()
            if loja and not conn.execute("SELECT 1 FROM produtos WHERE loja_id=?",
                                          (loja["id"],)).fetchone():
                seed_prod = [
                    ("Manga Tommy", "Doce e firme, colhida na semana.",
                     "R$ 6,90/kg", "Frutas & Verduras",
                     "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80", 30),
                    ("Alface crespa", "Orgânica, sem agrotóxico.",
                     "R$ 3,50 un", "Frutas & Verduras",
                     "https://images.unsplash.com/photo-1622206151226-18ca2c9d680f?w=400&q=80", 20),
                    ("Tomate italiano", "Ideal para molhos caseiros.",
                     "R$ 7,00/kg", "Frutas & Verduras",
                     "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80", 15),
                ]
                for nome_p, desc, preco, cat, img, est in seed_prod:
                    conn.execute("""
                        INSERT INTO produtos (loja_id, nome, descricao, preco,
                                              categoria, imagem, disponivel, estoque)
                        VALUES (?,?,?,?,?,?,1,?)
                    """, (loja["id"], nome_p, desc, preco, cat, img, est))
        conn.commit()
        print(">> Contas, loja e produtos de demonstração garantidos.")
    finally:
        conn.close()


# =====================================================================
# HELPERS
# =====================================================================
def rows_to_list(rows):
    return [dict(r) for r in rows]


def autenticar(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        uid = session.get("uid")
        if not uid:
            return jsonify({"erro": "Não autenticado"}), 401
        u = get_conn().execute("SELECT * FROM usuarios WHERE id=?", (uid,)).fetchone()
        if not u:
            session.clear()
            return jsonify({"erro": "Sessão inválida"}), 401
        g.usuario = dict(u)
        return f(*args, **kwargs)
    return wrapper


def exigir_tipo(*tipos):
    def deco(f):
        @wraps(f)
        @autenticar
        def wrapper(*args, **kwargs):
            if g.usuario["tipo"] not in tipos:
                return jsonify({"erro": "Acesso negado"}), 403
            return f(*args, **kwargs)
        return wrapper
    return deco


# =====================================================================
# AUTH
# =====================================================================
@app.post("/api/auth/register")
def register():
    data = request.get_json() or {}
    nome  = (data.get("nome") or "").strip()
    email = (data.get("email") or "").strip().lower()
    senha = data.get("senha") or ""
    if not nome or not email or len(senha) < 6:
        return jsonify({"erro": "Dados inválidos (senha mín. 6 caracteres)"}), 400

    conn = get_conn()
    try:
        if conn.execute("SELECT 1 FROM usuarios WHERE email=?", (email,)).fetchone():
            return jsonify({"erro": "E-mail já cadastrado"}), 409
        cur = conn.execute(
            "INSERT INTO usuarios (nome,email,senha_hash,tipo) VALUES (?,?,?,?)",
            (nome, email, generate_password_hash(senha), "cliente"),
        )
        commit(conn)
        uid = cur.lastrowid
    except sqlite3.IntegrityError as e:
        conn.rollback()
        return jsonify({"erro": f"Conflito: {e}"}), 409

    if not conn.execute("SELECT 1 FROM usuarios WHERE id=?", (uid,)).fetchone():
        return jsonify({"erro": "Falha ao gravar usuário"}), 500

    session["uid"] = uid
    return jsonify({"email": email, "type": "cliente", "name": nome}), 201


@app.post("/api/auth/login")
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    senha = data.get("senha") or ""

    u = get_conn().execute("SELECT * FROM usuarios WHERE email=?", (email,)).fetchone()
    if not u or not check_password_hash(u["senha_hash"], senha):
        return jsonify({"erro": "E-mail ou senha incorretos"}), 401

    session["uid"] = u["id"]
    session.permanent = True
    return jsonify({"email": u["email"], "type": u["tipo"], "name": u["nome"]})


@app.post("/api/auth/logout")
def logout():
    session.clear()
    return jsonify({"ok": True})


@app.get("/api/auth/session")
def get_session():
    uid = session.get("uid")
    if not uid:
        return jsonify(None)
    u = get_conn().execute("SELECT * FROM usuarios WHERE id=?", (uid,)).fetchone()
    if not u:
        session.clear()
        return jsonify(None)
    return jsonify({"email": u["email"], "type": u["tipo"], "name": u["nome"]})


# =====================================================================
# VISITAS
# =====================================================================
@app.post("/api/visits")
def registrar_visita():
    data = request.get_json() or {}
    stall_id = data.get("stallId")
    if not stall_id:
        return jsonify({"erro": "stallId obrigatório"}), 400
    conn = get_conn()
    conn.execute("INSERT INTO visitas (stall_id) VALUES (?)", (int(stall_id),))
    commit(conn)
    return jsonify({"ok": True})


# =====================================================================
# CATÁLOGO — barracas
# =====================================================================
FALLBACK_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"


def _hash_stall_id(email: str) -> int:
    h = 0
    for c in email:
        h = (h * 31 + ord(c)) & 0xFFFFFFFF
        if h >= 0x80000000:
            h -= 0x100000000
    return 900000000 + abs(h)


@app.get("/api/stalls")
def listar_stalls():
    conn = get_conn()
    rows = conn.execute("""
        SELECT u.email, u.nome AS owner_nome, l.*
        FROM usuarios u
        JOIN lojas l ON l.usuario_id = u.id
        WHERE u.tipo='vendedor' AND l.aberta=1
          AND EXISTS (SELECT 1 FROM produtos p
                      WHERE p.loja_id=l.id AND p.disponivel=1)
        ORDER BY l.nome
    """).fetchall()

    result = []
    for r in rows:
        prods = conn.execute("""
            SELECT * FROM produtos
            WHERE loja_id=? AND disponivel=1
            ORDER BY criado_em DESC
        """, (r["id"],)).fetchall()

        cover = r["banner"] or r["logo"] or FALLBACK_IMG
        result.append({
            "id": _hash_stall_id(r["email"]),
            "_vendorEmail": r["email"],
            "name": r["nome"] or r["owner_nome"] or "Barraca",
            "category": r["categoria"] or "Outros",
            "owner": r["owner_nome"] or "",
            "desc": r["descricao"] or "Loja parceira da feira.",
            "about": r["descricao"] or "Loja parceira da feira.",
            "cover": cover,
            "gallery": [cover, r["logo"] or FALLBACK_IMG, FALLBACK_IMG],
            "address": "Vitrine da loja na Feira Nuzzi",
            "hours": r["horario"] or "Consulte o horário na loja",
            "products": [{
                "name": p["nome"],
                "price": p["preco"],
                "desc": p["descricao"] or "",
                "img": p["imagem"] or FALLBACK_IMG,
                "estoque": p["estoque"],
            } for p in prods],
        })
    return jsonify(result)


# =====================================================================
# VENDEDOR
# =====================================================================
def _vendor_payload(conn, usuario_id: int) -> dict:
    loja = conn.execute("SELECT * FROM lojas WHERE usuario_id=?", (usuario_id,)).fetchone()
    if not loja:
        return {
            "loja": {"nome": "", "categoria": "", "descricao": "",
                     "tempo": "", "horario": "", "logo": "", "banner": "",
                     "aberta": False},
            "produtos": [], "pedidos": [],
        }

    produtos = conn.execute(
        "SELECT * FROM produtos WHERE loja_id=? ORDER BY criado_em DESC",
        (loja["id"],)
    ).fetchall()
    pedidos = conn.execute(
        "SELECT * FROM pedidos WHERE loja_id=? ORDER BY criado_em DESC",
        (loja["id"],)
    ).fetchall()

    return {
        "loja": {
            "nome": loja["nome"], "categoria": loja["categoria"],
            "descricao": loja["descricao"], "tempo": loja["tempo"],
            "horario": loja["horario"], "logo": loja["logo"],
            "banner": loja["banner"], "aberta": bool(loja["aberta"]),
        },
        "produtos": [{
            "id": p["id"], "nome": p["nome"], "descricao": p["descricao"],
            "preco": p["preco"], "categoria": p["categoria"],
            "imagem": p["imagem"], "disponivel": bool(p["disponivel"]),
            "estoque": p["estoque"],
        } for p in produtos],
        "pedidos": [{
            "id": p["id"], "cliente": p["cliente_nome"], "itens": p["itens"],
            "valor": p["valor"], "valorNumerico": p["valor_numerico"],
            "hora": p["hora"], "status": p["status"], "reservaId": p["reserva_id"],
        } for p in pedidos],
    }


@app.get("/api/vendor/data")
@exigir_tipo("vendedor")
def vendor_data():
    return jsonify(_vendor_payload(get_conn(), g.usuario["id"]))


@app.put("/api/vendor/loja")
@exigir_tipo("vendedor")
def vendor_update_loja():
    data = request.get_json() or {}
    campos = ("nome", "categoria", "descricao", "tempo", "horario", "logo", "banner")
    conn = get_conn()
    uid = g.usuario["id"]

    loja = conn.execute("SELECT * FROM lojas WHERE usuario_id=?", (uid,)).fetchone()

    if not loja:
        valores = {
            "nome":      data.get("nome")      or g.usuario["nome"],
            "categoria": data.get("categoria") or "",
            "descricao": data.get("descricao") or "",
            "tempo":     data.get("tempo")     or "",
            "horario":   data.get("horario")   or "",
            "logo":      data.get("logo")      or "",
            "banner":    data.get("banner")    or "",
            "aberta":    1 if data.get("aberta") else 0,
        }
        conn.execute("""
            INSERT INTO lojas (usuario_id, nome, categoria, descricao,
                               tempo, horario, logo, banner, aberta)
            VALUES (?,?,?,?,?,?,?,?,?)
        """, (uid, valores["nome"], valores["categoria"], valores["descricao"],
              valores["tempo"], valores["horario"], valores["logo"],
              valores["banner"], valores["aberta"]))
    else:
        sets, vals = [], []
        for c in campos:
            if c in data:
                sets.append(f"{c}=?")
                vals.append(data[c] or "")
        if "aberta" in data:
            sets.append("aberta=?")
            vals.append(1 if data["aberta"] else 0)
        if sets:
            sets.append("atualizado_em=datetime('now')")
            vals.append(uid)
            conn.execute(f"UPDATE lojas SET {', '.join(sets)} WHERE usuario_id=?", vals)

    commit(conn)
    check = conn.execute("SELECT id FROM lojas WHERE usuario_id=?", (uid,)).fetchone()
    if not check:
        return jsonify({"erro": "Falha ao gravar loja"}), 500
    return jsonify({"ok": True, "loja_id": check["id"]})


@app.post("/api/vendor/produtos")
@exigir_tipo("vendedor")
def vendor_criar_produto():
    data = request.get_json() or {}
    nome = (data.get("nome") or "").strip()
    if not nome:
        return jsonify({"erro": "Nome obrigatório"}), 400

    conn = get_conn()
    uid = g.usuario["id"]

    loja = conn.execute("SELECT id FROM lojas WHERE usuario_id=?", (uid,)).fetchone()
    if not loja:
        cur = conn.execute(
            "INSERT INTO lojas (usuario_id, nome) VALUES (?,?)",
            (uid, g.usuario["nome"])
        )
        commit(conn)
        loja_id = cur.lastrowid
    else:
        loja_id = loja["id"]

    cur = conn.execute("""
        INSERT INTO produtos (loja_id, nome, descricao, preco, categoria,
                              imagem, disponivel, estoque)
        VALUES (?,?,?,?,?,?,?,?)
    """, (
        loja_id, nome,
        data.get("descricao", ""),
        data.get("preco", "R$ 0,00"),
        data.get("categoria", ""),
        data.get("imagem", ""),
        1 if data.get("disponivel", True) else 0,
        data.get("estoque"),
    ))
    commit(conn)
    new_id = cur.lastrowid

    if not conn.execute("SELECT 1 FROM produtos WHERE id=?", (new_id,)).fetchone():
        return jsonify({"erro": "Falha ao gravar produto"}), 500

    return jsonify({"id": new_id, "ok": True}), 201


@app.put("/api/vendor/produtos/<int:pid>")
@exigir_tipo("vendedor")
def vendor_editar_produto(pid):
    data = request.get_json() or {}
    campos = ("nome", "descricao", "preco", "categoria",
              "imagem", "disponivel", "estoque")
    conn = get_conn()

    p = conn.execute("""
        SELECT p.id FROM produtos p
        JOIN lojas l ON l.id = p.loja_id
        WHERE p.id=? AND l.usuario_id=?
    """, (pid, g.usuario["id"])).fetchone()
    if not p:
        return jsonify({"erro": "Produto não encontrado"}), 404

    sets, vals = [], []
    for c in campos:
        if c in data:
            sets.append(f"{c}=?")
            if c == "disponivel":
                vals.append(1 if data[c] else 0)
            else:
                vals.append(data[c])
    if not sets:
        return jsonify({"ok": True, "msg": "Nada para atualizar"})

    vals.append(pid)
    conn.execute(f"UPDATE produtos SET {', '.join(sets)} WHERE id=?", vals)
    commit(conn)
    return jsonify({"ok": True})


@app.delete("/api/vendor/produtos/<int:pid>")
@exigir_tipo("vendedor")
def vendor_excluir_produto(pid):
    conn = get_conn()
    cur = conn.execute("""
        DELETE FROM produtos WHERE id=? AND loja_id IN
            (SELECT id FROM lojas WHERE usuario_id=?)
    """, (pid, g.usuario["id"]))
    commit(conn)
    if cur.rowcount == 0:
        return jsonify({"erro": "Produto não encontrado"}), 404
    return jsonify({"ok": True})


@app.put("/api/vendor/pedidos/<int:pid>/status")
@exigir_tipo("vendedor")
def vendor_update_pedido(pid):
    data = request.get_json() or {}
    status = data.get("status")
    if status not in ("pendente", "preparo", "pronto", "concluido", "cancelado"):
        return jsonify({"erro": "Status inválido"}), 400

    conn = get_conn()
    cur = conn.execute("""
        UPDATE pedidos SET status=? WHERE id=? AND loja_id IN
            (SELECT id FROM lojas WHERE usuario_id=?)
    """, (status, pid, g.usuario["id"]))
    commit(conn)
    if cur.rowcount == 0:
        return jsonify({"erro": "Pedido não encontrado"}), 404
    return jsonify({"ok": True, "status": status})


# =====================================================================
# PEDIDOS (cliente)
# =====================================================================
@app.post("/api/orders")
def criar_pedidos():
    uid = session.get("uid")
    if not uid:
        print("[orders] ✗ sem sessão ativa — 401")
        return jsonify({
            "erro": "Não autenticado",
            "dica": "Faça login novamente na mesma origem (localhost:5000)."
        }), 401

    conn = get_conn()
    u = conn.execute("SELECT * FROM usuarios WHERE id=?", (uid,)).fetchone()
    if not u:
        session.clear()
        print(f"[orders] ✗ uid={uid} não existe — 401")
        return jsonify({"erro": "Sessão inválida"}), 401

    if u["tipo"] != "cliente":
        print(f"[orders] ✗ usuário {u['email']} é {u['tipo']}, não cliente — 403")
        return jsonify({
            "erro": f"Apenas clientes podem fazer pedidos (você é {u['tipo']})"
        }), 403

    data = request.get_json(silent=True) or {}
    reserva_id = data.get("reservaId")
    stalls = data.get("stalls") or []
    print(f"[orders] uid={uid} reserva={reserva_id} stalls={len(stalls)}")
    if not stalls:
        return jsonify({"erro": "Sem itens"}), 400

    criados = []
    ignorados = []

    try:
        for s in stalls:
            email = (s.get("vendorEmail") or "").lower().strip()
            if not email:
                ignorados.append({"motivo": "sem vendorEmail", "stall": s.get("vendorEmail")})
                continue

            vend = conn.execute(
                "SELECT id, nome FROM usuarios WHERE email=? AND tipo='vendedor'",
                (email,)
            ).fetchone()
            if not vend:
                ignorados.append({"motivo": f"vendedor '{email}' não existe"})
                continue

            loja = conn.execute("SELECT id FROM lojas WHERE usuario_id=?",
                                (vend["id"],)).fetchone()
            if not loja:
                ignorados.append({"motivo": f"vendedor '{email}' sem loja"})
                continue

            itens_desc = ", ".join(
                f"{int(i.get('qty', 1))}x {i.get('name', '?')}"
                for i in (s.get("items") or [])
            )
            cur = conn.execute("""
                INSERT INTO pedidos (loja_id, cliente_id, cliente_nome,
                                     reserva_id, itens, valor, valor_numerico,
                                     hora, status)
                VALUES (?,?,?,?,?,?,?,?, 'pendente')
            """, (
                loja["id"], uid, u["nome"],
                reserva_id, itens_desc,
                s.get("valor", "R$ 0,00"),
                float(s.get("valorNumerico") or 0),
                datetime.now().strftime("%H:%M"),
            ))
            criados.append(cur.lastrowid)

        commit(conn)
    except sqlite3.Error as e:
        conn.rollback()
        print(f"[orders] ✗ erro SQLite: {e}")
        return jsonify({"erro": f"Falha ao gravar: {e}"}), 500

    if criados:
        placeholders = ",".join("?" * len(criados))
        n = conn.execute(
            f"SELECT COUNT(*) AS n FROM pedidos WHERE id IN ({placeholders})",
            criados
        ).fetchone()["n"]
        print(f"[orders] ✓ gravados={n}/{len(criados)} ignorados={len(ignorados)}")
        if n != len(criados):
            return jsonify({"erro": "Pedidos não persistiram"}), 500
    else:
        print(f"[orders] ✗ nenhum pedido gravado. ignorados={ignorados}")

    return jsonify({
        "ok": True,
        "pedidos": criados,
        "ignorados": ignorados,
    }), 201


@app.get("/api/orders/minhas")
@exigir_tipo("cliente")
def minhas_reservas():
    conn = get_conn()
    rows = conn.execute("""
        SELECT p.*, l.nome AS loja_nome
        FROM pedidos p
        JOIN lojas l ON l.id = p.loja_id
        WHERE p.cliente_id = ?
        ORDER BY p.criado_em DESC
    """, (g.usuario["id"],)).fetchall()
    return jsonify(rows_to_list(rows))


# =====================================================================
# ADMIN
# =====================================================================
@app.get("/api/admin/usuarios")
@exigir_tipo("adm")
def admin_usuarios():
    conn = get_conn()
    us = conn.execute("""
        SELECT id, nome, email, tipo, criado_em FROM usuarios ORDER BY id
    """).fetchall()
    return jsonify(rows_to_list(us))


@app.post("/api/admin/usuarios")
@exigir_tipo("adm")
def admin_criar_usuario():
    data = request.get_json() or {}
    tipo = data.get("tipo")
    if tipo not in ("cliente", "vendedor", "adm"):
        return jsonify({"erro": "Tipo inválido"}), 400
    nome  = (data.get("nome") or "").strip()
    email = (data.get("email") or "").strip().lower()
    senha = data.get("senha") or ""
    if not nome or not email or len(senha) < 6:
        return jsonify({"erro": "Dados inválidos"}), 400

    conn = get_conn()
    try:
        if conn.execute("SELECT 1 FROM usuarios WHERE email=?", (email,)).fetchone():
            return jsonify({"erro": "E-mail já cadastrado"}), 409
        cur = conn.execute(
            "INSERT INTO usuarios (nome,email,senha_hash,tipo) VALUES (?,?,?,?)",
            (nome, email, generate_password_hash(senha), tipo),
        )
        uid = cur.lastrowid
        if tipo == "vendedor":
            conn.execute("INSERT INTO lojas (usuario_id, nome) VALUES (?,?)",
                         (uid, nome))
        commit(conn)
    except sqlite3.IntegrityError as e:
        conn.rollback()
        return jsonify({"erro": f"Conflito: {e}"}), 409

    return jsonify({"id": uid, "ok": True}), 201


@app.get("/api/admin/reservas")
@exigir_tipo("adm")
def admin_reservas():
    conn = get_conn()
    rows = conn.execute("""
        SELECT p.*, l.nome AS loja_nome
        FROM pedidos p JOIN lojas l ON l.id = p.loja_id
        ORDER BY p.criado_em DESC
    """).fetchall()
    return jsonify(rows_to_list(rows))


@app.get("/api/admin/dashboard")
@exigir_tipo("adm")
def admin_dashboard():
    conn = get_conn()
    hoje = "date('now')"

    total_reservas = conn.execute(
        "SELECT COUNT(*) AS n FROM pedidos"
    ).fetchone()["n"]

    reservas_hoje = conn.execute(
        f"SELECT COUNT(*) AS n FROM pedidos WHERE date(criado_em) = {hoje}"
    ).fetchone()["n"]

    pendentes = conn.execute(
        "SELECT COUNT(*) AS n FROM pedidos WHERE status='pendente'"
    ).fetchone()["n"]

    lojas_ativas = conn.execute(
        "SELECT COUNT(*) AS n FROM lojas WHERE aberta=1"
    ).fetchone()["n"]

    estoque_baixo = conn.execute(
        "SELECT COUNT(*) AS n FROM produtos "
        "WHERE estoque IS NOT NULL AND estoque <= 3"
    ).fetchone()["n"]

    ultimas = conn.execute("""
        SELECT p.id, p.cliente_nome AS cliente, p.itens, p.valor,
               p.status, p.criado_em, l.nome AS loja
        FROM pedidos p JOIN lojas l ON l.id = p.loja_id
        ORDER BY p.criado_em DESC LIMIT 8
    """).fetchall()

    ranking = conn.execute("""
        SELECT l.nome AS loja, COUNT(p.id) AS reservas
        FROM lojas l
        LEFT JOIN pedidos p ON p.loja_id = l.id
        GROUP BY l.id
        ORDER BY reservas DESC
        LIMIT 6
    """).fetchall()

    return jsonify({
        "reservas_total": total_reservas,
        "reservas_hoje": reservas_hoje,
        "pendentes": pendentes,
        "lojas_ativas": lojas_ativas,
        "estoque_baixo": estoque_baixo,
        "ultimas": rows_to_list(ultimas),
        "ranking": rows_to_list(ranking),
    })


@app.get("/api/admin/lojas")
@exigir_tipo("adm")
def admin_lojas():
    conn = get_conn()
    rows = conn.execute("""
        SELECT l.*, u.nome AS dono_nome, u.email AS dono_email,
               (SELECT COUNT(*) FROM produtos WHERE loja_id=l.id) AS total_produtos,
               (SELECT COUNT(*) FROM pedidos  WHERE loja_id=l.id) AS total_reservas
        FROM lojas l JOIN usuarios u ON u.id = l.usuario_id
        ORDER BY l.nome
    """).fetchall()
    return jsonify(rows_to_list(rows))


@app.get("/api/admin/produtos")
@exigir_tipo("adm")
def admin_produtos():
    conn = get_conn()
    rows = conn.execute("""
        SELECT p.*, l.nome AS loja_nome,
               (SELECT COUNT(*) FROM pedidos WHERE loja_id=p.loja_id) AS reservas
        FROM produtos p JOIN lojas l ON l.id = p.loja_id
        ORDER BY l.nome, p.nome
    """).fetchall()
    return jsonify(rows_to_list(rows))


# =====================================================================
# DEBUG
# =====================================================================
@app.get("/api/_debug/contagens")
def _debug_contagens():
    conn = get_conn()
    return jsonify({
        "usuarios": conn.execute("SELECT COUNT(*) AS n FROM usuarios").fetchone()["n"],
        "lojas":    conn.execute("SELECT COUNT(*) AS n FROM lojas").fetchone()["n"],
        "produtos": conn.execute("SELECT COUNT(*) AS n FROM produtos").fetchone()["n"],
        "pedidos":  conn.execute("SELECT COUNT(*) AS n FROM pedidos").fetchone()["n"],
        "visitas":  conn.execute("SELECT COUNT(*) AS n FROM visitas").fetchone()["n"],
        "db_path":  str(DB_PATH),
    })


@app.get("/api/_debug/pedidos")
def _debug_pedidos():
    conn = get_conn()
    rows = conn.execute("""
        SELECT p.id, p.cliente_nome, p.itens, p.valor, p.status, p.criado_em,
               l.nome AS loja_nome
        FROM pedidos p JOIN lojas l ON l.id = p.loja_id
        ORDER BY p.id DESC LIMIT 50
    """).fetchall()
    return jsonify(rows_to_list(rows))


# =====================================================================
# ERROS
# =====================================================================
@app.errorhandler(404)
def nf(_):
    return jsonify({"erro": "Rota não encontrada"}), 404


@app.errorhandler(500)
def se(e):
    return jsonify({"erro": "Erro interno", "detalhe": str(e)}), 500


@app.errorhandler(sqlite3.Error)
def sqlerr(e):
    return jsonify({"erro": "Erro no banco", "detalhe": str(e)}), 500


# =====================================================================
# ESTÁTICOS
# =====================================================================
ALLOWED_STATIC = {
    "index.html", "style.css", "script.js",
    "parceiro.html", "parceiro.css", "parceiro.js",
    "admin.html", "admin.css", "admin.js",
}


@app.route("/")
def serve_index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/parceiro.html")
def serve_parceiro():
    return send_from_directory(BASE_DIR, "parceiro.html")


@app.route("/admin.html")
def serve_admin():
    return send_from_directory(BASE_DIR, "admin.html")


@app.route("/<path:filename>")
def serve_static(filename):
    if filename in ALLOWED_STATIC:
        return send_from_directory(BASE_DIR, filename)
    abort(404)


# =====================================================================
# START
# =====================================================================
init_db()
seed_demo()


if __name__ == "__main__":
    print("=" * 60)
    print(" Feira Nuzzi  ->  http://localhost:5000")
    print(" Parceiro     ->  http://localhost:5000/parceiro.html")
    print(" Admin        ->  http://localhost:5000/admin.html")
    print(" Banco SQLite ->  " + str(DB_PATH))
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000)