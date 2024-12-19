import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import BlacklistToken from "../models/blacklistToken.model.js";
import Captain from "../models/captain.model.js";
dotenv.config();

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
  console.log("Retrieved Token:", token);
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized token: No token provided",
    });
  }
const isBlackListed = await BlacklistToken.findOne({token :token})
if(isBlackListed)
{
  return res.status(401).json({
    message:"Unauthorized "
  })
}
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    const user = await User.findById(decoded._id);
    if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found",
        });
      }
    req.user = user;
    return next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};

export const verifyCaptain = async(req,res,next)=>{
  const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
  console.log("Retrieved Token:", token);
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized token: No token provided",
    });
  }
const isBlackListed = await BlacklistToken.findOne({token :token})
if(isBlackListed)
{
  return res.status(401).json({
    message:"Unauthorized "
  })
}
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    const captain = await Captain.findById(decoded._id);
    if (!captain) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found",
        });
      }
    req.captain =captain;
    return next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
}