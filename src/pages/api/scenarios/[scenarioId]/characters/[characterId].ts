import type { APIRoute } from 'astro';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const OPTIONS: APIRoute = async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
};

// PUT /api/scenarios/[scenarioId]/characters/[characterId]
export const PUT: APIRoute = async ({ params, request, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId, characterId } = params;
    try {
        const body = await request.json() as { name?: string; role?: string; backstory?: string; goal?: string };
        const { name, role, backstory, goal } = body;

        await env.DB.prepare(
            'UPDATE characters SET name = ?, role = ?, backstory = ?, goal = ? WHERE id = ? AND scenario_id = ?'
        ).bind(name ?? null, role ?? null, backstory ?? null, goal ?? null, characterId, scenarioId).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to update character' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};

// DELETE /api/scenarios/[scenarioId]/characters/[characterId]
export const DELETE: APIRoute = async ({ params, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId, characterId } = params;
    try {
        await env.DB.prepare(
            'DELETE FROM characters WHERE id = ? AND scenario_id = ?'
        ).bind(characterId, scenarioId).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to delete character' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};
