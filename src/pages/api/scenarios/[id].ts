import type { APIRoute } from 'astro';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const OPTIONS: APIRoute = async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
};

// GET /api/scenarios/[id]
export const GET: APIRoute = async ({ params, locals }) => {
    const env = locals.runtime.env;
    const { id } = params;
    try {
        const scenario = await env.DB.prepare(
            'SELECT id, title, description, created_at, updated_at FROM scenarios WHERE id = ?'
        ).bind(id).first();

        if (!scenario) {
            return new Response(JSON.stringify({ error: 'Scenario not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }
        return new Response(JSON.stringify(scenario), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch scenario' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};

// PUT /api/scenarios/[id]
export const PUT: APIRoute = async ({ params, request, locals }) => {
    const env = locals.runtime.env;
    const { id } = params;
    try {
        const body = await request.json() as { title?: string; description?: string };
        const { title, description } = body;

        await env.DB.prepare(
            'UPDATE scenarios SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(title ?? null, description ?? null, id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to update scenario' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};

// DELETE /api/scenarios/[id]
export const DELETE: APIRoute = async ({ params, locals }) => {
    const env = locals.runtime.env;
    const { id } = params;
    try {
        await env.DB.prepare('DELETE FROM scenarios WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to delete scenario' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};
