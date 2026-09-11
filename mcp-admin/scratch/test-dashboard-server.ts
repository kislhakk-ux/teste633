import http from 'http';
import { createApp } from '../src/server/app.js';

const app = createApp();
const server = app.listen(3002, async () => {
  console.log('Test server listening on port 3002');

  const fetchUrl = (urlPath: string, headers: Record<string, string> = {}): Promise<{ status: number; body: string }> => {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:3002${urlPath}`, { headers }, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode || 500, body }));
        res.on('error', reject);
      });
    });
  };

  try {
    const homeHtml = await fetchUrl('/', { Accept: 'text/html' });
    console.log('GET / (Accept: text/html) status:', homeHtml.status, 'Is HTML:', homeHtml.body.includes('<div id="root">'));

    const homeJson = await fetchUrl('/', { Accept: 'application/json' });
    console.log('GET / (Accept: application/json) status:', homeJson.status, 'Is JSON:', homeJson.body.includes('"success":true'));

    const playersRoute = await fetchUrl('/players/123');
    console.log('GET /players/123 status:', playersRoute.status, 'Is SPA HTML:', playersRoute.body.includes('<div id="root">'));

    const overview = await fetchUrl('/api/admin/dashboard');
    console.log('GET /api/admin/dashboard status:', overview.status);

    const tools = await fetchUrl('/api/mcp/tools');
    console.log('GET /api/mcp/tools status:', tools.status);
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close();
    console.log('Test server closed.');
  }
});
