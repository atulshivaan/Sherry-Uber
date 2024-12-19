import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters"],
    },
    lastName: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, "Email must have at least 5 characters"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    socketId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate JWT Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// Hash Password
userSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};



const User = mongoose.model("User", userSchema);
export default User;
