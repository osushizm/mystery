import type { APIRoute } from 'astro';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const OPTIONS: APIRoute = async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
};

// GET /api/scenarios/[scenarioId]/cards
export const GET: APIRoute = async ({ params, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId } = params;
    try {
        const { results } = await env.DB.prepare(
            'SELECT id, card_type, title, content, assigned_to_character_id FROM cards WHERE scenario_id = ? ORDER BY card_type, title'
        ).bind(scenarioId).all();
        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch cards' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};

// POST /api/scenarios/[scenarioId]/cards
export const POST: APIRoute = async ({ params, request, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId } = params;
    try {
        const body = await request.json() as {
            card_type?: string;
            title?: string;
            content?: string;
            assigned_to_character_id?: string;
        };
        const { card_type, title, content, assigned_to_character_id } = body;

        if (!card_type || !title || !content) {
            return new Response(
                JSON.stringify({ error: 'card_type, title, and content are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            );
        }

        const id = crypto.randomUUID();
        await env.DB.prepare(
            'INSERT INTO cards (id, scenario_id, card_type, title, content, assigned_to_character_id) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(id, scenarioId, card_type, title, content, assigned_to_character_id ?? null).run();

        return new Response(JSON.stringify({ id }), {
            status: 201,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create card' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};
