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