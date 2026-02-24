import type { APIRoute } from 'astro';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const OPTIONS: APIRoute = async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
};

// GET /api/scenarios
export const GET: APIRoute = async ({ locals }) => {
    const env = locals.runtime.env;
    try {
        const { results } = await env.DB.prepare(
            'SELECT id, title, description, created_at, updated_at FROM scenarios ORDER BY created_at DESC'
        ).all();
        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch scenarios' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};

// POST /api/scenarios
export const POST: APIRoute = async ({ request, locals }) => {
    const env = locals.runtime.env;
    try {
        const body = await request.json() as { title?: string; description?: string };
        const { title, description } = body;

        if (!title) {
            return new Response(JSON.stringify({ error: 'Title is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        const id = crypto.randomUUID();
        await env.DB.prepare(
            'INSERT INTO scenarios (id, title, description) VALUES (?, ?, ?)'
        ).bind(id, title, description ?? null).run();

        return new Response(JSON.stringify({ id }), {
            status: 201,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create scenario' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};
