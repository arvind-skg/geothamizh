import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function tamilTtsPlugin() {
  return {
    name: 'tamil-tts-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/tts')) {
          try {
            const parsedUrl = new URL(req.url, 'http://localhost');
            const text = parsedUrl.searchParams.get('text') || '';
            const lang = parsedUrl.searchParams.get('lang') || 'ta';
            if (!text) {
              res.statusCode = 400;
              res.end('Missing text query');
              return;
            }

            const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;
            const response = await fetch(googleUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://translate.google.com/'
              }
            });

            if (!response.ok) {
              res.statusCode = response.status;
              res.end(`TTS fetch error: ${response.statusText}`);
              return;
            }

            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            const arrayBuffer = await response.arrayBuffer();
            res.end(Buffer.from(arrayBuffer));
          } catch (err) {
            console.error('TTS proxy error:', err);
            res.statusCode = 500;
            res.end(err.message);
          }
          return;
        }

        if (req.url && req.url.startsWith('/api/image-proxy')) {
          try {
            const parsedUrl = new URL(req.url, 'http://localhost');
            const targetUrl = parsedUrl.searchParams.get('url');
            if (!targetUrl) {
              res.statusCode = 400;
              res.end('Missing url query');
              return;
            }
            const imgRes = await fetch(targetUrl);
            if (!imgRes.ok) {
              res.statusCode = imgRes.status;
              res.end(`Image fetch error: ${imgRes.statusText}`);
              return;
            }
            const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            const arrayBuffer = await imgRes.arrayBuffer();
            res.end(Buffer.from(arrayBuffer));
          } catch (err) {
            console.error('Image proxy error:', err);
            res.statusCode = 500;
            res.end(err.message);
          }
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tamilTtsPlugin()],
  server: {
    port: 5173,
    host: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});

