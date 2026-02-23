import { Router } from 'itty-router';
import type { Env } from '../_middleware';

const router = Router();

// GET /api/scenarios - 一覧取得
router.get('/api/scenarios', async (request: Request, env: Env) => {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, title, description, created_at, updated_at FROM scenarios ORDER BY created_at DESC'
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch scenarios' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// GET /api/scenarios/:id - 1件取得
router.get('/api/scenarios/:id', async (request: Request & { params: Record<string, string> }, env: Env) => {
  const { id } = request.params;

  try {
    const scenario = await env.DB.prepare(
      'SELECT id, title, description, created_at, updated_at FROM scenarios WHERE id = ?'
    ).bind(id).first();

    if (!scenario) {
      return new Response(JSON.stringify({ error: 'Scenario not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(scenario), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch scenario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// POST /api/scenarios - 新規作成
router.post('/api/scenarios', async (request: Request, env: Env) => {
  try {
    const body = await request.json() as { title?: string; description?: string };
    const { title, description } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(
      'INSERT INTO scenarios (id, title, description) VALUES (?, ?, ?)'
    ).bind(id, title, description ?? null).run();

    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to create scenario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// PUT /api/scenarios/:id - 更新
router.put('/api/scenarios/:id', async (request: Request & { params: Record<string, string> }, env: Env) => {
  const { id } = request.params;

  try {
    const body = await request.json() as { title?: string; description?: string };
    const { title, description } = body;

    await env.DB.prepare(
      'UPDATE scenarios SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(title ?? null, description ?? null, id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to update scenario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// DELETE /api/scenarios/:id - 削除
router.delete('/api/scenarios/:id', async (request: Request & { params: Record<string, string> }, env: Env) => {
  const { id } = request.params;

  try {
    await env.DB.prepare('DELETE FROM scenarios WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to delete scenario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

export default router;
