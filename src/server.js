// Simple demo sync server for Kanban-Board
// Run with: node server.js

const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // set simple CORS headers so the demo server works when your app is served from another origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // accept both '/api/sync' and '/api/sync/'
    if (req.method === 'POST' && (req.url === '/api/sync' || req.url === '/api/sync/')) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const payload = JSON.parse(body || '{}');
                console.log('Received sync payload:', JSON.stringify(payload, null, 2));

                // For demo: respond OK and echo back an empty results array
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ results: [], message: 'Synced (demo server)' }));
            } catch (err) {
                res.writeHead(400);
                res.end('invalid json');
            }
        });
        return;
    }

    // static file fallback for manual testing convenience
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Kanban demo sync server. Use POST /api/sync');
        return;
    }

    res.writeHead(404);
    res.end('not found');
});

server.listen(port, () => console.log(`Demo sync server listening on http://localhost:${port}`));
