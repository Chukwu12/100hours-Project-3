const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true},
  email: { type: String, unique: true },
  password: { type: String}
});


// Password hash middleware.
 
 UserSchema.pre('save', function save(next) {
  const user = this
    // Check if the password has been modified or if it's a new user
  if (!user.isModified('password')) { return next()
   }
    // Generate a salt and hash the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err)
       { return next(err)
        
        }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err) }
      user.password = hash // Replace plain password with hashed password
      next()  // Proceed to save the user
    })
  })
})


// Helper method for validating user's password.
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  // If cb is not a function, throw an error
  if (typeof cb !== 'function') {
      throw new TypeError('cb must be a function');
  }

  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);

