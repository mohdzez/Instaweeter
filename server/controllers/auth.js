import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      location,
      occupation,
      picturePath,
      friends,
      impressions,
      viewedProfile,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      location,
      occupation,
      picturePath,
      friends,
      impressions: Math.floor(Math.random() * 1000),
      viewedProfile: Math.floor(Math.random() * 1000),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
