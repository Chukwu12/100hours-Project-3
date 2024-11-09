const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
});

// Password hash middleware
UserSchema.pre('save', async function(next) {
  const user = this;
  
  // If the password has not been modified, skip hashing
  if (!user.isModified('password')) return next();
  
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    
    // Replace the plain password with the hashed password
    user.password = hashedPassword;
    
    next();  // Proceed to save the user
  } catch (err) {
    return next(err);  // Pass errors to the next middleware
  }
});

// Helper method for validating the user's password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;  // Return the result
  } catch (err) {
    throw new Error(err);  // Handle any errors that occur
  }
};

module.exports = mongoose.model('User', UserSchema);
