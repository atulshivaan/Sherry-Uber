import express from "express";
import { body } from "express-validator";
import { getUserProfile, registerUser ,UserLogin, userLogout } from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);


authRouter.post("/login",[
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
],UserLogin)


authRouter.get("/profile",verifyUser,getUserProfile)

authRouter.get("/logout",verifyUser,userLogout)
export default authRouter;
