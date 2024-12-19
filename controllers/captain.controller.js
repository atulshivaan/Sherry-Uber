import BlacklistToken from "../models/blacklistToken.model.js";
import Captain from "../models/captain.model.js";
import { createCaptain } from "../services/captain.service.js";
import { validationResult } from "express-validator";

export const registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  try {
    const isCaptainExist = await Captain.findOne({ email });
    if (isCaptainExist) {
      return res.status(400).json({ message: "Captain Already Exists" });
    }

    const hashPassword = await Captain.hashPassword(password);

    const captain = await createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashPassword,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ success: true, token, captain });
  } catch (error) {
    next(error);
  }
};

export const loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
  
    try {
      // Check if captain exists
      const captain = await Captain.findOne({ email }).select("+password");
      if (!captain) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Compare passwords
      const isMatch = await captain.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Generate token
      const token = captain.generateAuthToken();
  
      // Set token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true, // Prevent client-side scripts from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
  
      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        captain: {
          id: captain._id,
          fullname: captain.fullname,
          email: captain.email,
          vehicle: captain.vehicle,
        },
      });
    } catch (error) {
      next(error);
    }
  };

export const logoutCaptain = async(req,res,next)=>{
const token  = req.cookies.token || req.headers.authorization?.split("")[1];

await BlacklistToken.create({token});

res.clearCookie("token")

res.status(201).json({
    messae:"Logout Successfully"
})
};

export const getCaptainProfile =async(req,res,next)=>{
res.status(201).json({
    captain:req.captain
})
}
