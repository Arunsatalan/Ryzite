import express, { Router } from 'express';
import servicesRouter from './services.router.ts';
import projectsRouter from './projects.router.ts';
import blogsRouter from './blogs.router.ts';
import leadsRouter from './leads.router.ts';
import seoRouter from './seo.router.ts';
import analyticsRouter from './analytics.router.ts';
import aiRouter from './ai.router.ts';

const apiRouter: Router = express.Router();

// System Health
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Ryzite Production Backend API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mounted Sub-Routers
apiRouter.use('/services', servicesRouter);
apiRouter.use('/projects', projectsRouter);
apiRouter.use('/blogs', blogsRouter);
apiRouter.use('/leads', leadsRouter);
apiRouter.use('/seo', seoRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/ai', aiRouter);

export default apiRouter;
