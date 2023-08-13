const {BlobServiceClient} = require("@azure/storage-blob");
require("dotenv").config();
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerNameProduct = "fashion-app";
const containerNameUser = "fashion-app-user";

const containerClientProduct =blobServiceClient.getContainerClient(containerNameProduct);
const containerClientUser = blobServiceClient.getContainerClient(containerNameUser);

export { containerClientProduct, containerClientUser };
  

    

// router.post("/register", upload.single("profileImage"), async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//      console.log("Received registration request:", req.body);

//     // Check if a user with the provided email already exists
//     const existingUser = await User.findOne({email});
//     if (existingUser) {
//       return res
//         .status(409)
//         .json({message: "User with this email already exists"});
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//   console.log("Hashing password...");

//     let imageUrl = null; // Default to null if no image is uploaded
//     if (req.file) {
//       const file = req.file as Express.Multer.File;
//       const compressedImage = await sharp(file.buffer)
//         .resize(500, 500)
//         .jpeg({quality: 80})
//         .toBuffer();
      
//       // Generate a random filename
//       const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "");
//       const filename = `${sanitizedFileName}-${Date.now()}`;

//       const blockBlobClient = containerClientUser.getBlockBlobClient(filename);
//       await blockBlobClient.upload(compressedImage, compressedImage.length);

//       imageUrl = blockBlobClient.url;
//     } else {
//       // Generate a default image with a colored background based on the user's name or the first character of their name
//       const defaultImageText = name.charAt(0).toUpperCase(); // First character of the name
//       const backgroundColor = generateRandomColor(); // Generate a random color
//       const defaultImageBuffer = await generateDefaultImage(
//         defaultImageText,
//         backgroundColor
//       );
//       const defaultImageFilename = `default-${Date.now()}.jpg`;

//       const blockBlobClient =
//         containerClientUser.getBlockBlobClient(defaultImageFilename);
//       await blockBlobClient.upload(
//         defaultImageBuffer,
//         defaultImageBuffer.length
//       );

//       imageUrl = blockBlobClient.url;
//     }
//   console.log("Saving user to the database...");
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       profileImage: imageUrl,
      

//     });

//     await newUser.save();
//   console.log("User saved successfully:", newUser);
//     res.status(201).json({ message: "User registered successfully" });
//     console.log(
//       "🚀 ~ file: user.ts ~ line 93 ~ router.post ~ newUser",
//       newUser
//     );
    
//   } catch (error:any) {
//   console.log("Error registering user:", error);
//     res
//       .status(500)
//       .json({message: "Error registering user", error: error.message});
//   }
// });
  

    








