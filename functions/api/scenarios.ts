import { Router } from 'itty-router';

const router = Router();

// GET /api/scenarios - List all scenarios
router.get('/scenarios', async (request, env) => {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, title, description FROM scenarios ORDER BY created_at DESC'
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch scenarios' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// GET /api/scenarios/:id - Get specific scenario
router.get('/scenarios/:id', async (request, env) => {
  const { id } = request.params;

  try {
    const scenario = await env.DB.prepare(
      'SELECT id, title, description FROM scenarios WHERE id = ?'
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
    return new Response(JSON.stringify({ error: 'Failed to fetch scenario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// POST /api/scenarios - Create new scenario
router.post('/scenarios', async (request, env) => {
  try {
    const body = await request.json();
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
    ).bind(id, title, description || null).run();

    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create scenario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// PUT /api/scenarios/:id - Update scenario
router.put('/scenarios/:id', async (request, env) => {
  const { id } = request.params;

  try {
    const body = await request.json();
    const { title, description } = body;

    await env.DB.prepare(
      'UPDATE scenarios SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(title || null, description || null, id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update scenario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// DELETE /api/scenarios/:id - Delete scenario
router.delete('/scenarios/:id', async (request, env) => {
  const { id } = request.params;

  try {
    await env.DB.prepare('DELETE FROM scenarios WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete scenario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

export default router;
