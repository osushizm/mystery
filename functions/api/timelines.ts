import { Router } from 'itty-router';

const router = Router();

// GET /api/scenarios/:scenarioId/timelines - List timelines
router.get('/scenarios/:scenarioId/timelines', async (request, env) => {
  const { scenarioId } = request.params;

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, event_time, event_description FROM timelines WHERE scenario_id = ? ORDER BY event_time'
    ).bind(scenarioId).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch timelines' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// POST /api/scenarios/:scenarioId/timelines - Create timeline
router.post('/scenarios/:scenarioId/timelines', async (request, env) => {
  const { scenarioId } = request.params;

  try {
    const body = await request.json();
    const { event_time, event_description } = body;

    if (!event_time || !event_description) {
      return new Response(
        JSON.stringify({ error: 'event_time and event_description are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(
      'INSERT INTO timelines (id, scenario_id, event_time, event_description) VALUES (?, ?, ?, ?)'
    ).bind(id, scenarioId, event_time, event_description).run();

    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create timeline' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// PUT /api/scenarios/:scenarioId/timelines/:timelineId - Update timeline
router.put('/scenarios/:scenarioId/timelines/:timelineId', async (request, env) => {
  const { scenarioId, timelineId } = request.params;

  try {
    const body = await request.json();
    const { event_time, event_description } = body;

    await env.DB.prepare(
      'UPDATE timelines SET event_time = ?, event_description = ? WHERE id = ? AND scenario_id = ?'
    ).bind(event_time || null, event_description || null, timelineId, scenarioId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update timeline' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// DELETE /api/scenarios/:scenarioId/timelines/:timelineId - Delete timeline
router.delete('/scenarios/:scenarioId/timelines/:timelineId', async (request, env) => {
  const { scenarioId, timelineId } = request.params;

  try {
    await env.DB.prepare(
      'DELETE FROM timelines WHERE id = ? AND scenario_id = ?'
    ).bind(timelineId, scenarioId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete timeline' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

export default router;
