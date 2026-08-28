import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import apiRouter from './server/routes/index.ts';
import { generateSitemapXml, generateRobotsTxt } from './server/services/sitemap.service.ts';
import { requestLogger, errorHandler } from './server/middleware/requestLogger.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());
  app.use(requestLogger);

  // --- API BACKEND ROUTES ---
  app.use('/api', apiRouter);

  // --- SEO & SEARCH ENGINE CRAWLER ROUTES ---
  app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.send(generateSitemapXml());
  });

  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(generateRobotsTxt());
  });

  // Global Error Handler for API routes
  app.use(errorHandler);

  // --- VITE DEV / STATIC CLIENT ASSET SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Ryzite Full-Stack Engine running on http://localhost:${PORT}`);
  });
}

startServer();
