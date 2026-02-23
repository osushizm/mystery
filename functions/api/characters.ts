import { Router } from 'itty-router';
import type { Env } from '../_middleware';

const router = Router();

type RequestWithParams = Request & { params: Record<string, string> };

// GET /api/scenarios/:scenarioId/characters - 一覧取得
router.get('/api/scenarios/:scenarioId/characters', async (request: RequestWithParams, env: Env) => {
  const { scenarioId } = request.params;

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, role, backstory, goal FROM characters WHERE scenario_id = ? ORDER BY name'
    ).bind(scenarioId).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch characters' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// POST /api/scenarios/:scenarioId/characters - 新規作成
router.post('/api/scenarios/:scenarioId/characters', async (request: RequestWithParams, env: Env) => {
  const { scenarioId } = request.params;

  try {
    const body = await request.json() as { name?: string; role?: string; backstory?: string; goal?: string };
    const { name, role, backstory, goal } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(
      'INSERT INTO characters (id, scenario_id, name, role, backstory, goal) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, scenarioId, name, role ?? null, backstory ?? null, goal ?? null).run();

    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to create character' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// PUT /api/scenarios/:scenarioId/characters/:characterId - 更新
router.put('/api/scenarios/:scenarioId/characters/:characterId', async (request: RequestWithParams, env: Env) => {
  const { scenarioId, characterId } = request.params;

  try {
    const body = await request.json() as { name?: string; role?: string; backstory?: string; goal?: string };
    const { name, role, backstory, goal } = body;

    await env.DB.prepare(
      'UPDATE characters SET name = ?, role = ?, backstory = ?, goal = ? WHERE id = ? AND scenario_id = ?'
    ).bind(name ?? null, role ?? null, backstory ?? null, goal ?? null, characterId, scenarioId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to update character' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// DELETE /api/scenarios/:scenarioId/characters/:characterId - 削除
router.delete('/api/scenarios/:scenarioId/characters/:characterId', async (request: RequestWithParams, env: Env) => {
  const { scenarioId, characterId } = request.params;

  try {
    await env.DB.prepare(
      'DELETE FROM characters WHERE id = ? AND scenario_id = ?'
    ).bind(characterId, scenarioId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to delete character' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

export default router;
