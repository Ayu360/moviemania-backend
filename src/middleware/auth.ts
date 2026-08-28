import { Request, Response, NextFunction } from 'express';
import { verifyAppToken, AppJwtPayload } from '../lib/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: AppJwtPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing bearer token' });
    return;
  }
  const token = header.slice('Bearer '.length);
  try {
    req.user = verifyAppToken(token, process.env.JWT_SECRET!);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
