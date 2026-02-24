import type { APIRoute } from 'astro';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const OPTIONS: APIRoute = async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
};

// PUT /api/scenarios/[scenarioId]/timelines/[timelineId]
export const PUT: APIRoute = async ({ params, request, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId, timelineId } = params;
    try {
        const body = await request.json() as { event_time?: string; event_description?: string };
        const { event_time, event_description } = body;

        await env.DB.prepare(
            'UPDATE timelines SET event_time = ?, event_description = ? WHERE id = ? AND scenario_id = ?'
        ).bind(event_time ?? null, event_description ?? null, timelineId, scenarioId).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to update timeline' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};

// DELETE /api/scenarios/[scenarioId]/timelines/[timelineId]
export const DELETE: APIRoute = async ({ params, locals }) => {
    const env = locals.runtime.env;
    const { scenarioId, timelineId } = params;
    try {
        await env.DB.prepare(
            'DELETE FROM timelines WHERE id = ? AND scenario_id = ?'
        ).bind(timelineId, scenarioId).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to delete timeline' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
};
