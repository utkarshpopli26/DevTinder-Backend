const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 35,
      },
      lastName: {
        type: String,
        minLength: 4,
        maxLength: 35,
      },
      emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Invalid email address: " + value);
          }
        },
      },
      password: {
        type: String,
        required: true,
        validate(value) {
          if (!validator.isStrongPassword(value)) {
            throw new Error("Enter a Strong Password: " + value);
          }
        },
      },
      age: {
        type: Number,
        min: 18,
      },
      gender: {
        type: String,
        enum: {
          values: ["male", "female", "other"],
          message: `{VALUE} is not a valid gender type`,
        },
      },
      isPremium: {
        type: Boolean,
        default: false,
      },
      membershipType: {
        type: String,
      },
      photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
          if (!validator.isURL(value)) {
            throw new Error("Invalid Photo URL: " + value);
          }
        },
      },
      about: {
        type: String,
        default: "This is a default about of the user!",
      },
      skills: {
        type: [String],
      },
    },
    {
      timestamps: true,
    }
  );


userSchema.methods.getJwt = async function() {
  const user = this;

  const token = await jwt.sign({_id: user._id}, "DevTinder");
  return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;
  const passwordHash = user.password;

  const isCorrectPassword = await bcrypt.compare(passwordInputByUser, passwordHash);		 
	
  return isCorrectPassword;
};

const user = mongoose.model("User", userSchema);

module.exports = user;