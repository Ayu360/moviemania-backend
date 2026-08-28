import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './firebase';
import { connectDb } from './db';
import authRouter from './routes/auth';
import meRouter from './routes/me';

const PORT = Number(process.env.PORT ?? 4000);

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  const jwtSecret = process.env.JWT_SECRET;
  if (!mongoUri) throw new Error('MONGODB_URI is required');
  if (!jwtSecret) throw new Error('JWT_SECRET is required');

  await connectDb(mongoUri);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/auth', authRouter);
  app.use('/me', meRouter);

  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('[server] fatal', err);
  process.exit(1);
});
