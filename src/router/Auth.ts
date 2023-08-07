
import express, {Express, Request, Response, NextFunction} from "express";
const router = express.Router();
import {
  Category,
  Color,
  Size,
  Product,
  Review,
  User,
  Order,
  CartItem,
  Cart,
} from "../model/Model";

interface AuthenticatedRequest extends Request {
  userId: string;
  user: any; // You can define a more specific User type here if needed
}


import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// Register a new user
router.post("/register", async (req, res) => {
  try {
    const {name, email, password} = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: "Email already registered"});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({message: "User registered successfully"});
  } catch (error) {
    res.status(500).json({message: "Registration failed"});
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;

    // Check if user exists
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    // Generate JWT token
    const token = jwt.sign({userId: user._id}, "your_secret_key_here", {
      expiresIn: "1h",
    });

    res.status(200).json({token, userId: user._id});
  } catch (error) {
    res.status(500).json({message: "Login failed"});
  }
});






// Update user profile
// Update user profile
router.put("/profile", async (req, res) => {
  try {
    const { userId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

// Delete user account
router.delete("/delete", async (req, res) => {
  try {
    const { userId } = req.body;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Account deletion failed" });
  }
});

module.exports = router;












// router for Admin Role Assignment:
router.post("/assign-admin-role", async (req, res) => {
  const {userId} = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({error: "User not found."});
    }
    user.role = "admin";
    await user.save();
    res.status(200).json({message: "User role updated to admin."});
  } catch (error) {
    res.status(500).json({error: "An error occurred."});
  }
});



export default router;

