import jwt from 'jsonwebtoken';

export type AppJwtPayload = {
  appUid: string;
  email: string;
};

const EXPIRES_IN = '30d';

export function signAppToken(payload: AppJwtPayload, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: EXPIRES_IN });
}

export function verifyAppToken(token: string, secret: string): AppJwtPayload {
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === 'string' || !('appUid' in decoded) || !('email' in decoded)) {
    throw new Error('Invalid token payload');
  }
  return { appUid: decoded.appUid as string, email: decoded.email as string };
}
