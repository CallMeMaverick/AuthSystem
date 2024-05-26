const express = require('express');
const passport = require("passport")
const router = express.Router();
const userController = require("../controllers/userController");
const { ensureAuthenticated } = require("../middleware/auth");

router.post('/signup', userController.signUp);
router.post("/signin", userController.signIn);

// Google OAuth routes
router.get('/auth/google', (req, res, next) => {
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    (req, res, next) => {
        next();
    },
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/protected'); // Redirect to protected route after successful authentication
    }
);

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/protected');
    }
);


// Protected route
router.get('/protected', ensureAuthenticated, userController.protected);

// Logout route
router.get('/logout', userController.logOut);

module.exports = router;
