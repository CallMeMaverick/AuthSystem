const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/database');
const router = require('./routes');
require('./config/passport-config')(passport); // Ensure this initializes Passport config
require('dotenv').config();

const app = express();
connectDB(process.env.MONGO_STRING);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.get('/', (req, res) => {
  res.redirect('/signin');
});
app.get('/signin', (req, res) => {
  const logoutMessage = req.query.logout ? "Logged out successfully" : null;
  res.render('index', { title: 'Sign In', logoutMessage });
});
app.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('signup', { title: 'Error', errorMessage: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

