import { Router } from 'itty-router';

const router = Router();

// GET /api/scenarios/:scenarioId/characters - List characters
router.get('/scenarios/:scenarioId/characters', async (request, env) => {
  const { scenarioId } = request.params;

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, role, backstory, goal FROM characters WHERE scenario_id = ? ORDER BY name'
    ).bind(scenarioId).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch characters' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// POST /api/scenarios/:scenarioId/characters - Create character
router.post('/scenarios/:scenarioId/characters', async (request, env) => {
  const { scenarioId } = request.params;

  try {
    const body = await request.json();
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
    ).bind(id, scenarioId, name, role || null, backstory || null, goal || null).run();

    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create character' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// PUT /api/scenarios/:scenarioId/characters/:characterId - Update character
router.put('/scenarios/:scenarioId/characters/:characterId', async (request, env) => {
  const { scenarioId, characterId } = request.params;

  try {
    const body = await request.json();
    const { name, role, backstory, goal } = body;

    await env.DB.prepare(
      'UPDATE characters SET name = ?, role = ?, backstory = ?, goal = ? WHERE id = ? AND scenario_id = ?'
    ).bind(name || null, role || null, backstory || null, goal || null, characterId, scenarioId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update character' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// DELETE /api/scenarios/:scenarioId/characters/:characterId - Delete character
router.delete('/scenarios/:scenarioId/characters/:characterId', async (request, env) => {
  const { scenarioId, characterId } = request.params;

  try {
    await env.DB.prepare(
      'DELETE FROM characters WHERE id = ? AND scenario_id = ?'
    ).bind(characterId, scenarioId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete character' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

export default router;
