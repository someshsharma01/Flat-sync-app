const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  mobileNumber: { type: String },
  photoUrl: { type: String },
  address: { type: String },
  aboutMe: { type: String },
  preferences: {
    gender: { type: String, enum: ['Male', 'Female'] },
    organizedRoom: { type: String, enum: ['Yes', 'No'] },
    smokeOrDrink: { type: String, enum: ['Yes', 'No', 'Occasionally'] },
    foodPreference: { type: String, enum: ['Veg', 'Non-Veg'] },
    profession: { type: String, enum: ['Student', 'Working'] },
    sleepSchedule: { type: String, enum: ['Late Night', 'Early Night', 'Early in the Night'] }
  },
  onboardingComplete: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
