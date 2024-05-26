const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2");
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
            callbackURL: "https://auth-system-maverick-df7b9ab09da7.herokuapp.com/auth/google/callback"
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

    // Configure GithubStrategy
    passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "https://auth-system-maverick-df7b9ab09da7.herokuapp.com/auth/github/callback",
            scope: ['user:email'] // Requesting email scope
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Find user by GitHub ID
                let user = await User.findOne({ githubId: profile.id });

                if (!user) {
                    // Fetch user's emails
                    const emails = await fetch('https://api.github.com/user/emails', {
                        headers: {
                            'Authorization': `token ${accessToken}`,
                            'User-Agent': 'your-app-name'
                        }
                    }).then(res => res.json());

                    // Find primary email or fallback to first email in list
                    const primaryEmail = emails.find(email => email.primary && email.verified) || emails[0];

                    user = new User({
                        githubId: profile.id,
                        email: primaryEmail ? primaryEmail.email : null,
                    });

                    await user.save();
                }
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        }));


    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // req.session.passport.user -> req.session.user
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    })
};
