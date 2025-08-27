'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8787;

// MIME types for static file serving
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, data, headers = {}) {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    ...headers
  });
  res.end(payload);
}

function proxyOpenRouter(reqBody) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      reject(new Error('Missing OPENROUTER_API_KEY environment variable'));
      return;
    }

    const postData = JSON.stringify(reqBody);

    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.HTTP_REFERER || 'http://localhost',
        'X-Title': process.env.X_TITLE || 'Voice AI Assistant'
      }
    };

    const orReq = https.request(options, (orRes) => {
      let data = '';
      orRes.on('data', chunk => data += chunk);
      orRes.on('end', () => {
        resolve({ status: orRes.statusCode || 500, body: data, headers: orRes.headers });
      });
    });

    orReq.on('error', (err) => reject(err));
    orReq.write(postData);
    orReq.end();
  });
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) req.connection.destroy();
    });

    req.on('end', async () => {
      try {
        const json = body ? JSON.parse(body) : {};
        // Support pass-through (messages array) and simple { message }
        let requestBody;

        if (json.messages && Array.isArray(json.messages)) {
          requestBody = {
            model: json.model || 'meta-llama/llama-3.2-3b-instruct:free',
            messages: json.messages,
            max_tokens: json.max_tokens || 500
          };
        } else {
          const message = (json.message || '').toString();
          if (!message) {
            sendJson(res, 400, { error: 'message is required' });
            return;
          }
          requestBody = {
            model: 'meta-llama/llama-3.2-3b-instruct:free',
            messages: [
              { role: 'system', content: 'You are a helpful assistant. Respond in the same language as the user\'s message.' },
              { role: 'user', content: message }
            ],
            max_tokens: 500
          };
        }

        const orResp = await proxyOpenRouter(requestBody);

        // Pass through OpenRouter response JSON as-is
        res.writeHead(orResp.status, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(orResp.body);
      } catch (err) {
        console.error('Server error:', err);
        sendJson(res, 500, { error: err.message || 'Internal Server Error' });
      }
    });

    return;
  }

  // Serve static files
  if (req.method === 'GET') {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, '..', filePath);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(path.join(__dirname, '..'))) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404);
          res.end('File not found');
        } else {
          res.writeHead(500);
          res.end('Server error');
        }
        return;
      }

      const ext = path.extname(filePath);
      const mimeType = mimeTypes[ext] || 'application/octet-stream';
      
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
