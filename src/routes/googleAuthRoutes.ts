import express from 'express';
import passport from '../middleware/passport';

const router = express.Router();

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (_req, res) => {
    res.redirect('https://front-graduation.vercel.app/getlocation');
  }
);

export default router;