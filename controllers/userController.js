const User = require('../models/User');
const passport = require('passport');
const { validateEmail, validatePassword } = require('../utils/authValidators');

exports.signUp = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).render('signup', {
                title: 'Sign Up',
                errorMessage: 'Email already in use',
            });
        }

        if (!validateEmail(email)) {
            return res.render('signup', {
                title: 'Sign Up',
                errorMessage: 'Invalid email format',
            });
        }

        if (!validatePassword(password)) {
            return res.render('signup', {
                title: 'Sign Up',
                errorMessage: 'Invalid password format',
            });
        }

        const user = new User({ email, password });
        await user.save();

        res.status(201).render('index', {
            title: 'Sign In',
            successMessage: 'Sign up successful! Please log in.',
        });
    } catch (error) {
        next(error);
    }
};

exports.signIn = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.render("index", {
                title: "Sign In",
                errorMessage: info.message
            })
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            res.redirect("protected")
        })
    })(req, res, next);
}

exports.protected = (req, res, next) => {
    res.render("protected");
}

exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            done(err);
        }

        res.redirect("/signin?logout=true");
    })
}