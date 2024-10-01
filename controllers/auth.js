const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password, confirmPassword) => {
  const errors = [];
  if (validator.isEmpty(password)) {
    errors.push({ msg: "Password cannot be blank." });
  }
  if (!validator.isLength(password, { min: 8 })) {
    errors.push({ msg: "Password must be at least 8 characters long." });
  }
  if (password !== confirmPassword) {
    errors.push({ msg: "Passwords do not match." });
  }
  return errors;
};

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("login", { title: "Login" });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  
  if (!validateEmail(req.body.email)) {
    validationErrors.push({ msg: "Please enter a valid email address." });
  }
  
  const passwordErrors = validatePassword(req.body.password, '');
  validationErrors.push(...passwordErrors);

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.');
  });
  req.session.destroy((err) => {
    if (err) {
      console.log("Error: Failed to destroy the session during logout.", err);
    }
    req.user = null;
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup", { title: "Create Account" });
};

exports.postSignup = async (req, res, next) => {
  const validationErrors = [];

  if (!validateEmail(req.body.email)) {
    validationErrors.push({ msg: "Please enter a valid email address." });
  }

  const passwordErrors = validatePassword(req.body.password, req.body.confirmPassword);
  validationErrors.push(...passwordErrors);

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
  });

  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });

    if (existingUser) {
      req.flash("errors", { msg: "Account with that email address or username already exists." });
      return res.redirect("../signup");
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    
    await user.save();
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/profile");
    });
  } catch (err) {
    return next(err);
  }
};
