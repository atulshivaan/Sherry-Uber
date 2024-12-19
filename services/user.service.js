import User from "../models/user.model.js";

export const createUser = async ({ firstName, lastName, email, password }) => {
  if (!firstName || !email || !password) {
    throw new Error("All fields are mandatory");
  }
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });
  return user;
};
