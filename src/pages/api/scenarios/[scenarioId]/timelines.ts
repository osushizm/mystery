import type { APIRoute } from 'astro';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const OPTIONS: APIRoute = async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
};

// GET /api/scenarios/[scenarioId]/timelines
export const GET: APIRoute = async ({ params, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId } = params;
    try {
        const { results } = await env.DB.prepare(
            'SELECT id, event_time, event_description FROM timelines WHERE scenario_id = ? ORDER BY event_time'
        ).bind(scenarioId).all();
        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch timelines' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};

// POST /api/scenarios/[scenarioId]/timelines
export const POST: APIRoute = async ({ params, request, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId } = params;
    try {
        const body = await request.json() as { event_time?: string; event_description?: string };
        const { event_time, event_description } = body;

        if (!event_time || !event_description) {
            return new Response(
                JSON.stringify({ error: 'event_time and event_description are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            );
        }

        const id = crypto.randomUUID();
        await env.DB.prepare(
            'INSERT INTO timelines (id, scenario_id, event_time, event_description) VALUES (?, ?, ?, ?)'
        ).bind(id, scenarioId, event_time, event_description).run();

        return new Response(JSON.stringify({ id }), {
            status: 201,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create timeline' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};
