import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
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

export default router;
