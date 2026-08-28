import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { firebaseAdmin } from '../firebase';
import { User } from '../models/User';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const user = await User.findOne({ appUid: req.user!.appUid });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({
    appUid: user.appUid,
    email: user.email,
    name: user.name,
    photoURL: user.photoURL,
    provider: user.provider,
  });
});

router.delete('/', requireAuth, async (req, res) => {
  const user = await User.findOne({ appUid: req.user!.appUid });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Delete the Firebase account first. If Mongo deletion later fails, the
  // user can sign in again and postFirebaseToken will rebuild a fresh record
  // from the new Firebase uid — no permanently-orphaned state.
  try {
    await firebaseAdmin.auth().deleteUser(user.firebaseUid);
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code !== 'auth/user-not-found') {
      res.status(500).json({ error: 'Failed to delete Firebase account' });
      return;
    }
  }

  await User.deleteOne({ _id: user._id });

  res.status(204).send();
});

export default router;
