import type { APIRoute } from 'astro';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const OPTIONS: APIRoute = async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
};

// PUT /api/scenarios/[scenarioId]/cards/[cardId]
export const PUT: APIRoute = async ({ params, request, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId, cardId } = params;
    try {
        const body = await request.json() as {
            card_type?: string;
            title?: string;
            content?: string;
            assigned_to_character_id?: string;
        };
        const { card_type, title, content, assigned_to_character_id } = body;

        await env.DB.prepare(
            'UPDATE cards SET card_type = ?, title = ?, content = ?, assigned_to_character_id = ? WHERE id = ? AND scenario_id = ?'
        ).bind(
            card_type ?? null,
            title ?? null,
            content ?? null,
            assigned_to_character_id ?? null,
            cardId,
            scenarioId
        ).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to update card' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};

// DELETE /api/scenarios/[scenarioId]/cards/[cardId]
export const DELETE: APIRoute = async ({ params, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId, cardId } = params;
    try {
        await env.DB.prepare(
            'DELETE FROM cards WHERE id = ? AND scenario_id = ?'
        ).bind(cardId, scenarioId).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to delete card' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};
