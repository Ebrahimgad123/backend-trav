import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },

    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0].value });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails?.[0].value,
            password: Math.random().toString(36).slice(-8), 
            phone: '0000000000',
            profileImage: profile.photos?.[0].value,
            role: 'user',
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

// تسلسل المستخدم
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;