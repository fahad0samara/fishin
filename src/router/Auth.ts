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
          public_id: `profile-${Date.now()}`,
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
        id: user.id,
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
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  
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

//update the user
router.put(
  "/update/:userId",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const { name, email, deleteProfileImage } = req.body;

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
    const publicId = user.profileImage.split("/")[4]; // Modify this index as needed
    const deleteResult = await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted ${JSON.stringify(deleteResult)}`);


    if (deleteResult.result === "ok") {
      user.profileImage = ""; // Remove the profileImage field from the user document
    } else {
      console.error("Error deleting image from Cloudinary:", deleteResult);
    }
  }

        // Delete the existing profile image from Cloudinary
        if (user.profileImage) {
          // Delete the image using cloudinary.uploader.destroy()
          const publicId = user.profileImage.split("/")[4]; // Modify this index as needed
          const deleteResult = await cloudinary.uploader.destroy(publicId);

          if (deleteResult.result === "ok") {
            user.profileImage = ""; // Remove the profileImage field from the user document
          }
        }
      } else if (req.file) {
        // Update the profile image if a new image is provided
        const file = req.file as Express.Multer.File;
        const compressedImage = await sharp(file.buffer)
          .resize(500, 500)
          .jpeg({ quality: 80 })
          .toBuffer();

        // Generate a unique identifier for the new image
        const uniqueId = `${userId}-${Date.now()}`;

        // Upload the compressedImage to Cloudinary and get the secure URL
        const result = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${compressedImage.toString("base64")}`,
          {
            folder: "user-profile-images",
            public_id: `profile-${uniqueId}`, // Use a unique identifier
            overwrite: true,
          }
        );

        user.profileImage = result.secure_url;
      }

      await user.save();

      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error: any) {
      console.log(error);
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



    res.status(200).json({ message: "Logout successful" });
  });
});


    
router.delete("/delete/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this user" });
    }

    // Delete the user's profile image from Cloudinary
    if (user.profileImage) {
      // Delete the image using cloudinary.uploader.destroy()
      const publicId = user.profileImage.split("/")[4]; // Modify this index as needed
      const deleteResult = await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted ${JSON.stringify(deleteResult)}`);
    }
    await Cart.deleteMany({ user: userId });
    await CartItem.deleteMany({ user: userId });
    await Review.deleteMany({ user: userId });
 
    await Order.deleteMany({ user: userId });

    await User.findOneAndDelete({ _id: userId }).exec();

    res
      .status(200)
      .json({ message: "User and associated data deleted successfully" });
  } catch (error:any) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});


// Register a new admin user
router.post("/register-admin", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if an admin with the provided email already exists
    const existingAdmin = await User.findOne({ email, role: "admin" });
    if (existingAdmin) {
      return res
        .status(409)
        .json({ message: "Admin with this email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = null; // Default to null if no image is uploaded

    // Handle image upload using Cloudinary
    if (req.file) {
      const file = req.file;
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
    }

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      profileImage: imageUrl,
      role: "admin", // Set role to admin
    });

    await newAdmin.save();
    console.log("Admin user saved successfully:", newAdmin);
    res.status(201).json({ message: "Admin user registered successfully" });
  } catch (error:any) {
    console.log("Error registering admin:", error);
    res
      .status(500)
      .json({ message: "Error registering admin", error: error.message });
  }
});


// Get all users
router.get("/all", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
     const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
const sortField = (req.query.sortField as string) || "name"; // Default sorting field
const sortOrder = (req.query.sortOrder as "asc" | "desc") || "asc"; // Default sorting order

const sortOptions: any = { [sortField]: sortOrder === "desc" ? -1 : 1 };
    const users = await User.find({})
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort(sortOptions)
      .exec();

    res.status(200).json(users);
  } catch (error: any) {
    console.log("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user's image from Cloudinary
    if (user.profileImage) {
      // Delete the image using cloudinary.uploader.destroy()
      const publicId = user.profileImage.split("/")[4]; // Modify this index as needed
      const deleteResult = await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted ${JSON.stringify(deleteResult)}`);
    }
   
    
 
    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error: any) {
    console.log("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});












export default router;