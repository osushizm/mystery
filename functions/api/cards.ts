import { Router } from 'itty-router';

const router = Router();

// GET /api/scenarios/:scenarioId/cards - List cards
router.get('/scenarios/:scenarioId/cards', async (request, env) => {
  const { scenarioId } = request.params;

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, card_type, title, content, assigned_to_character_id FROM cards WHERE scenario_id = ? ORDER BY card_type, title'
    ).bind(scenarioId).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch cards' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// POST /api/scenarios/:scenarioId/cards - Create card
router.post('/scenarios/:scenarioId/cards', async (request, env) => {
  const { scenarioId } = request.params;

  try {
    const body = await request.json();
    const { card_type, title, content, assigned_to_character_id } = body;

    if (!card_type || !title || !content) {
      return new Response(
        JSON.stringify({ error: 'card_type, title, and content are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(
      'INSERT INTO cards (id, scenario_id, card_type, title, content, assigned_to_character_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      id,
      scenarioId,
      card_type,
      title,
      content,
      assigned_to_character_id || null
    ).run();

    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create card' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// PUT /api/scenarios/:scenarioId/cards/:cardId - Update card
router.put('/scenarios/:scenarioId/cards/:cardId', async (request, env) => {
  const { scenarioId, cardId } = request.params;

  try {
    const body = await request.json();
    const { card_type, title, content, assigned_to_character_id } = body;

    await env.DB.prepare(
      'UPDATE cards SET card_type = ?, title = ?, content = ?, assigned_to_character_id = ? WHERE id = ? AND scenario_id = ?'
    ).bind(
      card_type || null,
      title || null,
      content || null,
      assigned_to_character_id || null,
      cardId,
      scenarioId
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update card' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// DELETE /api/scenarios/:scenarioId/cards/:cardId - Delete card
router.delete('/scenarios/:scenarioId/cards/:cardId', async (request, env) => {
  const { scenarioId, cardId } = request.params;

  try {
    await env.DB.prepare(
      'DELETE FROM cards WHERE id = ? AND scenario_id = ?'
    ).bind(cardId, scenarioId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete card' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

export default router;
