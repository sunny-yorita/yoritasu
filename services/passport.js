const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  if (user) done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.Google.clientID,
      clientSecret: keys.Google.clientSecret,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const registeredUser = await User.findOne({ googleId: profile.id });
      if (registeredUser) {
        console.log('user already exists');
        done(null, registeredUser);
      } else {
        const newUser = await new User({ googleId: profile.id }).save();
        done(null, newUser);
      }
    }
  )
);
