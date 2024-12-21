const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // questionAnswer: {
    //   type: String,
    //   required: false,
    // },
    score: {
      type: Number,
      required: false,
    },
    roomId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (email, password) {
  // To create a user both password and email should be not empty
  if (!email || !password) {
    throw Error("Invalid Credentials: All fields must be filled!");
  }

  if (!validator.isEmail(email)) {
    throw Error("Validation Error: Email should be in correct format!");
  }

  const alreadyExists = await this.findOne({ email });

  if (alreadyExists) {
    throw Error("Already Exists Error: Email already in use!");
  }

  // Generate a salt for password hashing
  // The number 8 determines the complexity of the salt (higher is more secure but slower)
  const salt = await bcrypt.genSalt(8);

  // Hash the password using the generated salt
  // This creates a secure, one-way hash of the password
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user in the database
  // We store the hashed password, not the original password
  const newUser = await this.create({ email, password: hashedPassword });
  newUser.userId = newUser._id;
  newUser.score = 0;
  await newUser.save();

  return newUser;
};

userSchema.statics.signin = async function (email, password) {
  // A user should have non-empty password and email
  if (!email || !password) {
    throw Error("Invalid Credentials: All fields must be filled!");
  }

  if (!validator.isEmail(email)) {
    throw Error("Validation Error: Email should be in correct format!");
  }

  const user = await this.findOne({ email: email });

  // User should be in the database as well as password should be matched
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return user;
    }
  }

  throw Error(
    "Invalid Credentials: Username or/and password is/are incorrect!"
  );
};

module.exports = mongoose.model("User", userSchema);
