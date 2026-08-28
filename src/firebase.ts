import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

function loadCredential(): admin.credential.Credential {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inline && inline.trim().length > 0) {
    return admin.credential.cert(JSON.parse(inline));
  }
  const filePath = path.resolve(process.cwd(), 'service-account.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(
      'Firebase credentials missing: set FIREBASE_SERVICE_ACCOUNT_JSON env var or place service-account.json at project root',
    );
  }
  return admin.credential.cert(filePath);
}

admin.initializeApp({ credential: loadCredential() });

export const firebaseAdmin = admin;
