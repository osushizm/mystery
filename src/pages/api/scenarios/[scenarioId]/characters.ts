import type { APIRoute } from 'astro';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const OPTIONS: APIRoute = async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
};

// GET /api/scenarios/[scenarioId]/characters
export const GET: APIRoute = async ({ params, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId } = params;
    try {
        const { results } = await env.DB.prepare(
            'SELECT id, name, role, backstory, goal FROM characters WHERE scenario_id = ? ORDER BY name'
        ).bind(scenarioId).all();
        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch characters' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};

// POST /api/scenarios/[scenarioId]/characters
export const POST: APIRoute = async ({ params, request, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId } = params;
    try {
        const body = await request.json() as { name?: string; role?: string; backstory?: string; goal?: string };
        const { name, role, backstory, goal } = body;

        if (!name) {
            return new Response(JSON.stringify({ error: 'Name is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        const id = crypto.randomUUID();
        await env.DB.prepare(
            'INSERT INTO characters (id, scenario_id, name, role, backstory, goal) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(id, scenarioId, name, role ?? null, backstory ?? null, goal ?? null).run();

        return new Response(JSON.stringify({ id }), {
            status: 201,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create character' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};
