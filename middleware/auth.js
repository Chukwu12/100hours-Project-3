// middleware/auth.js
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
      return next(); // User is authenticated, proceed to the next middleware
  }
  req.flash('error', 'You need to log in to access this page.');
  res.redirect('/login'); // User is not authenticated, redirect to login
}
  module.exports = { ensureAuth };
