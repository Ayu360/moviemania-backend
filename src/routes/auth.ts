import { Router } from 'express';
import { randomUUID } from 'crypto';
import { firebaseAdmin } from '../firebase';
import { User } from '../models/User';
import { signAppToken } from '../lib/jwt';

const router = Router();

router.post('/firebase', async (req, res) => {
  const { idToken } = req.body ?? {};
  if (typeof idToken !== 'string' || idToken.length === 0) {
    res.status(400).json({ error: 'idToken is required' });
    return;
  }

  let decoded;
  try {
    decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
  } catch (err) {
    res.status(401).json({ error: 'Invalid Firebase ID token' });
    return;
  }

  const email = decoded.email;
  if (!email) {
    res.status(400).json({ error: 'Firebase token has no email' });
    return;
  }

  const firebaseUid = decoded.uid;
  const provider = 'google' as const;
  const name = decoded.name ?? null;
  const photoURL = decoded.picture ?? null;

  const existing = await User.findOne({ email: email.toLowerCase() });
  const user = existing
    ? await User.findOneAndUpdate(
        { _id: existing._id },
        { firebaseUid, name, photoURL, provider },
        { new: true },
      )
    : await User.create({
        appUid: randomUUID(),
        email: email.toLowerCase(),
        firebaseUid,
        name,
        photoURL,
        provider,
      });

  const appToken = signAppToken(
    { appUid: user!.appUid, email: user!.email },
    process.env.JWT_SECRET!,
  );

  res.json({
    appUid: user!.appUid,
    appToken,
    user: {
      email: user!.email,
      name: user!.name,
      photoURL: user!.photoURL,
      provider: user!.provider,
    },
  });
});

export default router;
