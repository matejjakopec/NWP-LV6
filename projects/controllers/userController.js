const User = require('../models/User');
const passport = require('passport');

exports.getRegisterForm = (req, res) => {
  res.render('auth/register');
};

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    await User.create({ username, password });
    res.redirect('/users/login');
  } catch (err) {
    res.status(500).send('Registration failed');
  }
};

exports.getLoginForm = (req, res) => {
  res.render('auth/login');
};

exports.loginUser = passport.authenticate('local', {
  successRedirect: '/projects',
  failureRedirect: '/users/login'
});

exports.logoutUser = (req, res) => {
  req.logout(() => {
    res.redirect('/users/login');
  });
};