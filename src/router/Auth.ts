
import express, { Express, Request, Response, NextFunction } from "express";

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
import { generateDefaultImage, generateRandomColor, sanitizeFileName } from "../config/generateImage";


const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
     console.log("Received registration request:", req.body);

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res
        .status(409)
        .json({message: "User with this email already exists"});
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
        .jpeg({quality: 80})
        .toBuffer();
      
      // Generate a random filename
      const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "");
      const filename = `${sanitizedFileName}-${Date.now()}`;

      const blockBlobClient = containerClientUser.getBlockBlobClient(filename);
      await blockBlobClient.upload(compressedImage, compressedImage.length);

      imageUrl = blockBlobClient.url;
    } else {
      // Generate a default image with a colored background based on the user's name or the first character of their name
      const defaultImageText = name.charAt(0).toUpperCase(); // First character of the name
      const backgroundColor = generateRandomColor(); // Generate a random color
      const defaultImageBuffer = await generateDefaultImage(
        defaultImageText,
        backgroundColor
      );
      const defaultImageFilename = `default-${Date.now()}.jpg`;

      const blockBlobClient =
        containerClientUser.getBlockBlobClient(defaultImageFilename);
      await blockBlobClient.upload(
        defaultImageBuffer,
        defaultImageBuffer.length
      );

      imageUrl = blockBlobClient.url;
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
    console.log(
      "🚀 ~ file: user.ts ~ line 93 ~ router.post ~ newUser",
      newUser
    );
    
  } catch (error:any) {
  console.log("Error registering user:", error);
    res
      .status(500)
      .json({message: "Error registering user", error: error.message});
  }
});




router.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;

    // Check if a user with the provided email exists
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message:`the 
        email ${email} is not found`});
      
        
      
    }

    // Check if the provided password matches the one in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({message: "the password is not correct"});
    }
    // Generate a token for authentication
    

    const token = jwt.sign(
      {id: user._id, name: user.name, email: user.email, role: user.role},
      process.env.JWT_SECRET || "",
      {expiresIn: "1d"}
    );


 

    res.status(200).json({message: "Authentication successful", 
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
  
  } catch (error:any) {
    console.log(error.message);
    
    res.status(500).json({message: "Error during login", error: error.message});
  }
});

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  jwt.verify(token, "your-secret-key", (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}







// Example usage of the middleware
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch user data from the database using userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Access granted to protected route", user });
  } catch (error:any) {
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
});



//
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user data from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    res.status(200).json(user);
  } catch (error:any) {
    res
      .status(500)
      .json({message: "Error fetching user data", error: error.message});
  }
});



router.put(
  "/update-profile/:userId",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const userId = req.params.userId; // User ID from the route parameter
      const {name} = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({message: "User not found"});
      }

      if (req.file) {
        const file = req.file as Express.Multer.File;
        const compressedImage = await sharp(file.buffer)
          .resize(500, 500)
          .jpeg({quality: 80})
          .toBuffer();

        const sanitizedFileName = sanitizeFileName(file.originalname);
        const filename = `${sanitizedFileName}-${Date.now()}`;

        const blockBlobClient =
          containerClientUser.getBlockBlobClient(filename);
        await blockBlobClient.upload(compressedImage, compressedImage.length);

        const imageUrl = blockBlobClient.url;

        // Delete the previous profile image if it exists
        if (user.profileImage) {
          const previousImageName = user.profileImage.split("/").pop(); // Extract the image name
          const previousImageBlobClient =
            containerClientUser.getBlockBlobClient(previousImageName);
          await previousImageBlobClient.deleteIfExists();
        }

        // Update user's profileImage field with the new image URL
        user.profileImage = imageUrl;
      }

      // Update user's other information
      user.name = name;

      await user.save();

      res.status(200).json({message: "Profile updated successfully", user});
    } catch (error:any) {
      res
        .status(500)
        .json({message: "Error updating profile", error: error.message});
    }
  }
);





// router for get all user
router.get("/users", async (req, res) => {
  try {
    
      const users = await User.find({}, {password: 0}); 
    
    res.status(200).json(users);
    
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching user data", error: error.message });
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

