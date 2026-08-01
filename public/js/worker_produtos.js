/* ================================================================
   PRODUTOS — CRUD admin + vínculo N:N com resources (trilhas e afins).
   Tabelas usadas (já existentes no D1):
     - products         (slug único, url obrigatório, external/active flags)
     - resource_products (FK CASCADE em ambos os lados; position por vínculo)
   Padrão de handler idêntico a worker_trilhas.js:
     - assume env.DB (D1) e utilitários globais (json, logEvent).
     - respostas sempre em JSON com { ok, ... } ou { ok:false, erro, ... }.
================================================================ */

const PROD_SLUG_RE = /^[a-z0-9-]{2,60}$/;
const PROD_ICON_RE = /^[a-z0-9-]{2,60}$/;

/* Sanitiza / normaliza payload de produto. Retorna { ok, val|erro }. */
function sanearProduto(body) {
  if (!body || typeof body !== 'object') return { ok: false, erro: 'Corpo inválido.' };

  const slug        = String(body.slug || '').trim().toLowerCase();
  const label       = String(body.label || '').trim();
  const description = body.description == null ? null : String(body.description).trim();
  const url         = String(body.url || '').trim();
  const icon        = body.icon == null ? null : String(body.icon).trim().toLowerCase();
  const external    = body.external ? 1 : 0;
  const active      = (body.active === 0 || body.active === false || body.active === '0') ? 0 : 1;
  const id          = body.id != null && body.id !== '' ? Number(body.id) : null;

  if (!PROD_SLUG_RE.test(slug))      return { ok: false, erro: 'Slug inválido (a-z 0-9 hífen, 2–60).' };
  if (!label)                        return { ok: false, erro: 'Rótulo é obrigatório.' };
  if (!url)                          return { ok: false, erro: 'URL é obrigatória.' };
  if (icon && !PROD_ICON_RE.test(icon))
                                     return { ok: false, erro: 'Ícone MDI inválido (a-z 0-9 hífen, 2–60).' };
  if (id != null && !Number.isFinite(id))
                                     return { ok: false, erro: 'ID inválido.' };

  return {
    ok: true,
    val: { id, slug, label, description: description || null, url, icon: icon || null, external, active },
  };
}

/* GET /api/admin/produtos/list
   Retorna todos os produtos, seus vínculos agregados e a lista de resources
   disponíveis para o seletor de vínculos na UI. */
async function produtosList(request, env) {
  try {
    const [prods, links, res] = await env.DB.batch([
      env.DB.prepare(
        'SELECT id, slug, label, description, url, icon, external, active, created_at, updated_at ' +
        'FROM products ORDER BY label COLLATE NOCASE'
      ),
      env.DB.prepare(
        'SELECT rp.product_id, rp.resource_key, rp.position, r.label AS resource_label ' +
        'FROM resource_products rp ' +
        'LEFT JOIN resources r ON r.key = rp.resource_key ' +
        'ORDER BY rp.product_id, rp.position, rp.resource_key'
      ),
      env.DB.prepare('SELECT key, label FROM resources ORDER BY label COLLATE NOCASE'),
    ]);

    const byId = new Map();
    (prods.results || []).forEach(p => {
      byId.set(p.id, Object.assign({}, p, { vinculos: [] }));
    });
    (links.results || []).forEach(l => {
      const p = byId.get(l.product_id);
      if (p) p.vinculos.push({
        resource_key:   l.resource_key,
        resource_label: l.resource_label || l.resource_key,
        position:       l.position,
      });
    });

    return json({
      ok: true,
      products:  [...byId.values()],
      resources: res.results || [],
    });
  } catch (e) {
    return json({ ok: false, erro: 'Falha ao listar produtos.', message: String((e && e.message) || e) }, 500);
  }
}

/* POST /api/admin/produtos/save
   Cria (se `slug` novo e `id` ausente) ou atualiza (por `id`).
   Se `id` ausente mas `slug` já existir, faz upsert por slug (idempotente).
   Body: { id?, slug, label, description?, url, icon?, external?, active? } */
async function produtosSave(request, env) {
  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const s = sanearProduto(body);
  if (!s.ok) return json({ ok: false, erro: s.erro }, 400);
  const v = s.val;
  const now = new Date().toISOString();

  try {
    if (v.id != null) {
      /* Update explícito por ID; garante que o slug não colide com outro registro. */
      const dup = await env.DB.prepare(
        'SELECT id FROM products WHERE slug = ? AND id <> ?'
      ).bind(v.slug, v.id).first();
      if (dup) return json({ ok: false, erro: 'Slug já usado por outro produto.' }, 409);

      const r = await env.DB.prepare(
        'UPDATE products SET slug=?, label=?, description=?, url=?, icon=?, external=?, active=?, updated_at=? ' +
        'WHERE id=?'
      ).bind(v.slug, v.label, v.description, v.url, v.icon, v.external, v.active, now, v.id).run();
      if (!r.meta || r.meta.changes === 0) return json({ ok: false, erro: 'Produto não encontrado.' }, 404);
      await logEvent(env, null, 'produto_atualizado', v.slug);
      return json({ ok: true, id: v.id, criado: false });
    }

    /* Sem ID: tenta upsert por slug. */
    const existente = await env.DB.prepare('SELECT id FROM products WHERE slug=?').bind(v.slug).first();
    if (existente) {
      await env.DB.prepare(
        'UPDATE products SET label=?, description=?, url=?, icon=?, external=?, active=?, updated_at=? ' +
        'WHERE id=?'
      ).bind(v.label, v.description, v.url, v.icon, v.external, v.active, now, existente.id).run();
      await logEvent(env, null, 'produto_atualizado', v.slug);
      return json({ ok: true, id: existente.id, criado: false });
    }
    const ins = await env.DB.prepare(
      'INSERT INTO products (slug, label, description, url, icon, external, active, created_at, updated_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(v.slug, v.label, v.description, v.url, v.icon, v.external, v.active, now, now).run();
    const newId = ins.meta && ins.meta.last_row_id;
    await logEvent(env, null, 'produto_criado', v.slug);
    return json({ ok: true, id: newId, criado: true });
  } catch (e) {
    return json({ ok: false, erro: 'Falha ao salvar produto.', message: String((e && e.message) || e) }, 500);
  }
}

/* POST /api/admin/produtos/delete  Body: { id }
   ON DELETE CASCADE em resource_products.product_id limpa os vínculos. */
async function produtosDelete(request, env) {
  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }
  const id = Number(body.id);
  if (!Number.isFinite(id)) return json({ ok: false, erro: 'ID inválido.' }, 400);

  try {
    const p = await env.DB.prepare('SELECT slug FROM products WHERE id=?').bind(id).first();
    if (!p) return json({ ok: false, erro: 'Produto não encontrado.' }, 404);
    await env.DB.prepare('DELETE FROM products WHERE id=?').bind(id).run();
    await logEvent(env, null, 'produto_excluido', p.slug);
    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, erro: 'Falha ao excluir produto.', message: String((e && e.message) || e) }, 500);
  }
}

/* POST /api/admin/produtos/vinculos/save
   Substitui TODOS os vínculos do produto pelo conjunto informado (delete-then-insert
   em batch, dentro de uma única transação D1). Rejeita resource_keys inexistentes.
   Body: { product_id, links: [{ resource_key, position? }] } */
async function produtosVinculosSave(request, env) {
  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, erro: 'Requisição inválida.' }, 400); }

  const productId = Number(body.product_id);
  if (!Number.isFinite(productId)) return json({ ok: false, erro: 'product_id inválido.' }, 400);
  if (!Array.isArray(body.links))   return json({ ok: false, erro: 'links deve ser um array.' }, 400);

  /* Dedup por resource_key + normalização de position. */
  const seen = new Set();
  const links = [];
  for (const raw of body.links) {
    const key = String((raw && raw.resource_key) || '').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const posNum = Number(raw && raw.position);
    const pos = Number.isFinite(posNum) ? Math.max(0, Math.trunc(posNum)) : 0;
    links.push({ resource_key: key, position: pos });
  }

  try {
    const p = await env.DB.prepare('SELECT id, slug FROM products WHERE id=?').bind(productId).first();
    if (!p) return json({ ok: false, erro: 'Produto não encontrado.' }, 404);

    /* Valida existência dos resources ANTES de escrever. */
    if (links.length) {
      const placeholders = links.map(() => '?').join(',');
      const q = await env.DB.prepare(
        'SELECT key FROM resources WHERE key IN (' + placeholders + ')'
      ).bind(...links.map(l => l.resource_key)).all();
      const validos = new Set((q.results || []).map(r => r.key));
      const invalidos = links.filter(l => !validos.has(l.resource_key)).map(l => l.resource_key);
      if (invalidos.length) return json({ ok: false, erro: 'Resource(s) inexistente(s): ' + invalidos.join(', ') }, 400);
    }

    const now = new Date().toISOString();
    const ops = [
      env.DB.prepare('DELETE FROM resource_products WHERE product_id=?').bind(productId),
    ];
    for (const l of links) {
      ops.push(env.DB.prepare(
        'INSERT INTO resource_products (resource_key, product_id, position, created_at) VALUES (?, ?, ?, ?)'
      ).bind(l.resource_key, productId, l.position, now));
    }
    await env.DB.batch(ops);
    await logEvent(env, null, 'produto_vinculos_atualizados', p.slug + ':' + links.length);
    return json({ ok: true, total: links.length });
  } catch (e) {
    return json({ ok: false, erro: 'Falha ao salvar vínculos.', message: String((e && e.message) || e) }, 500);
  }
}

/* ================================================================
   Exports (Cloudflare Workers modules-format / ESM).
   Se a integração no worker admin for por CONCATENAÇÃO de arquivos
   (não por `import`), remova o bloco abaixo — ele quebrará o parse.
================================================================ */
export {
  produtosList,
  produtosSave,
  produtosDelete,
  produtosVinculosSave,
};