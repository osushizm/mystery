import { Router } from 'itty-router';
import scenariosRouter from './api/scenarios';
import charactersRouter from './api/characters';
import timelinesRouter from './api/timelines';
import cardsRouter from './api/cards';

const router = Router();

// CORS middleware
router.all('*', (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
});

// Mount routers
router.all('/api/*', scenariosRouter.handle);
router.all('/api/*', charactersRouter.handle);
router.all('/api/*', timelinesRouter.handle);
router.all('/api/*', cardsRouter.handle);

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
});

export default router;
