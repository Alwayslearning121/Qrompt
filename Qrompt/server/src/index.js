import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 8787;
const PROVIDER = process.env.AI_PROVIDER || 'echo';
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

function authMiddleware(req, res, next) {
  const header = req.get('Authorization') || '';
  if (!AUTH_TOKEN) return next();
  if (header === `Bearer ${AUTH_TOKEN}`) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

function subMiddleware(req, res, next) {
  // Replace with real subscription logic (Stripe, etc.)
  const active = true;
  if (!active) return res.status(402).json({ error: 'Payment Required' });
  next();
}

app.get('/healthz', (_req, res) => {
  res.json({ ok: true });
});

app.get('/v1/subscription/check', authMiddleware, (req, res) => {
  res.json({ active: true, plan: 'dev-basic' });
});

app.post('/v1/generate', authMiddleware, subMiddleware, async (req, res) => {
  const { prompt, model } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  if (PROVIDER === 'echo') {
    return res.json({ output: `[${model || 'dev-basic'}] ${prompt}` });
  }

  // Placeholder for real provider integrations
  return res.json({ output: `[${model || 'dev-basic'}] ${prompt}` });
});

app.listen(PORT, () => {
  console.log(`Qrompt proxy listening on http://localhost:${PORT}`);
});

