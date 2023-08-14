import express, { Express, Request, Response, NextFunction } from "express";
import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({
  cloud_name: "dh5w04awz",
  api_key: "154856233692976",
  api_secret: "sD9lI3ztLqo62It9mEias2Cqock",
});

const router = express.Router();
import  {
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


declare module "express-serve-static-core" {
  interface Request {
    user: any;
  }
}
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { containerClientUser } from "../config/azure-config";
import sharp from "sharp";
import multer from "multer";
import {
  generateDefaultImage,
  generateRandomColor,
  sanitizeFileName,
} from "../config/generateImage";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Received registration request:", req.body);

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Hashing password...");

    let imageUrl = null; // Default to null if no image is uploaded
    if (req.file) {
      const file = req.file as Express.Multer.File;
      const compressedImage = await sharp(file.buffer)
        .resize(500, 500)
        .jpeg({ quality: 80 })
        .toBuffer();

      // Upload the compressedImage to Cloudinary and get the secure URL
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${compressedImage.toString("base64")}`,
        {
          folder: "user-profile-images",
          public_id: `profile-${Date.now()}`,
          overwrite: true,
        }
      );

      imageUrl = result.secure_url;
    } else {
      // Generate a default image using Jimp
      const defaultImageText = name.charAt(0).toUpperCase();
      const backgroundColor = generateRandomColor();
      const defaultImageBuffer = await generateDefaultImage(
        defaultImageText,
        backgroundColor
      );

      // Upload the defaultImageBuffer to Cloudinary and get the secure URL
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${defaultImageBuffer.toString("base64")}`,
        {
          folder: "user-profile-images",
          public_id: `profile-default-${Date.now()}`,
          overwrite: true,
        }
      );

      imageUrl = result.secure_url;
    }

    console.log("Saving user to the database...");
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImage: imageUrl,
    });

    await newUser.save();
    console.log("User saved successfully:", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    console.log("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if a user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: `The email ${email} is not found` });
    }

    // Check if the provided password matches the one in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "The password is not correct" });
    }

    // Generate a token for authentication
    const token = jwt.sign(
      {
        id: user._id,
      },
      "your-secret-key",
      {
        expiresIn: "1d", // Set the token expiration time (e.g., 1 hour)
      }
    );

    res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
    console.log(user);
  } catch (error: any) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
});

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "your-secret-key", (err: any, decodedData: any) => {
    if (err) {
      console.log("JWT Verification Error:", err);
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decodedData; // Include the user field
    next();
  });
}

// Example usage of the middleware
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
});

router.put(
  "/update/:userId",
  authenticateToken,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const { name, email, deleteProfileImage } = req.body;

      // Check if the user is updating their own profile
      if (req.user.id !== userId) {
        return res
          .status(403)
          .json({ message: "You're not authorized to update this profile" });
      }

      // Fetch the user from the database
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user fields
      if (name) user.name = name;
      if (email) user.email = email;

      // Handle profile image updates or deletions
      if (deleteProfileImage === "true") {
        // Delete the existing profile image from Cloudinary
        if (user.profileImage) {
          // Delete the image using cloudinary.uploader.destroy()
          await cloudinary.uploader.destroy("your-image-public-id");

          // Remove the profileImage field from the user document
          user.profileImage = "";
        }
      } else if (req.file) {
        // Update the profile image if a new image is provided
        const file = req.file as Express.Multer.File;
        const compressedImage = await sharp(file.buffer)
          .resize(500, 500)
          .jpeg({ quality: 80 })
          .toBuffer();

        // Upload the compressedImage to Cloudinary and get the secure URL
        const result = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${compressedImage.toString("base64")}`,
          {
            folder: "user-profile-images",
            public_id: `profile-${Date.now()}`,
            overwrite: true,
          }
        );

        user.profileImage = result.secure_url;
      }

      await user.save();

      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error:any) {
      res
        .status(500)
        .json({ message: "Error updating profile", error: error.message });
    }
  }
);

//logout
router.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Perform token verification using jwt.verify()
  jwt.verify(token, "your-secret-key", (err) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Perform any additional actions for token invalidation or revocation here
    // For example, add the token to a 'revokedTokens' set

    res.status(200).json({ message: "Logout successful" });
  });
});







export default router;