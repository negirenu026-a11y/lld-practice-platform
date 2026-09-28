import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { connectDB } from './db.js';
import problemRoutes from './routes/problems.js';
import submissionRoutes from './routes/submissions.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start
async function start() {
  await connectDB();

  // Force container initialization (triggers DI wiring + AI provider log)
  await import('./container.js');

  app.listen(config.port, () => {
    console.log(`✓ Server running on http://localhost:${config.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export { app };
