const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require("dotenv").config()

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async function(email, password, done) {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return done(null, false, { message: 'Incorrect password' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

    // Configure GoogleStrategy
    passport.use(new GoogleStrategy({
            // provide GOOGLE_CLIENT_ID
            clientID: process.env.GOOGLE_CLIENT_ID,
            // provide GOOGLE_CLIENT_SECRET
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // specify callback
            callbackURL: "http://localhost:5001/auth/google/callback"
        },
        async (token, tokenSecret, profile, done) => {
            console.log("Google profile:", profile);
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                    });

                    await user.save();
                }
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    })
};
