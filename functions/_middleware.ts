import scenariosRouter from './api/scenarios';
import charactersRouter from './api/characters';
import timelinesRouter from './api/timelines';
import cardsRouter from './api/cards';

export interface Env {
  DB: D1Database;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function addCors(response: Response): Response {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
  return new Response(response.body, { status: response.status, headers });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // API 以外のリクエストは Astro の静的/SSR ハンドラへ
  if (!url.pathname.startsWith('/api/')) {
    return next();
  }

  // CORS プリフライト
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // 各ルーターに順番にディスパッチ（マッチしなければ undefined）
  const routers = [scenariosRouter, charactersRouter, timelinesRouter, cardsRouter];

  for (const router of routers) {
    const response = await router.handle(request, env);
    if (response) {
      return addCors(response);
    }
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};
