import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import BlacklistToken from "../models/blacklistToken.model.js";

export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    const hashedPassword = await User.hashPassword(password);

    const user = await createUser({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashedPassword,
    });

    const token = user.generateAuthToken(); // Call on the user instance
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const UserLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    console.log("User found ",user);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Compare provided password with stored hashed password
    const isMatch = await user.comparePassword(password);
    console.log("Password Match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Generate JWT token
    const token = user.generateAuthToken();
    res.cookie("token",token)
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getUserProfile =async(req,res,next)=>{
res.status(201).json(
  req.user
)
}

export const userLogout = async(req,res,next)=>{
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split('')[1];

  await BlacklistToken.create({token});

  res.status(201).json({
    message:"logout"
  })

}