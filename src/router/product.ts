import express from "express";
import {
  containerClient,
  createContainerIfNotExists,
} from "../config/azure-config";
const router = express.Router();
import sharp from "sharp";

import multer from "multer";
import {Product} from "../model/Model";
// configure Multer to use Azure Blob Storage as the storage engine
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
router.post("/add", upload.array("images", 5), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({error: "No file uploaded"});
    }
    // compress the image using Sharp
    const compressedImage = await sharp(file.buffer)
      .resize(500, 500)
      .jpeg({quality: 80})
      .toBuffer();
    if (!req.file) {
      return res.status(400).json({error: "No file uploaded"});
    }

    // generate a unique filename for the file
    const filename = `${file.originalname}-${Date.now()}`;

    // create a new block blob with the generated filename
    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    // upload the compressed image to Azure Blob Storage
    await blockBlobClient.upload(compressedImage, compressedImage.length);

    // Create a new product with the uploaded image URLs
    const newProduct = new Product({
      ...req.body,
      image: blockBlobClient.url,
      image_url: blockBlobClient.url,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({message: "Error creating product"});
  }
});


// Get all products
router.get("/get", async (req, res) => {
  try {
    const products = await Product.find().populate("category colors sizes");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Get a single product by ID
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate("category colors sizes");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// Create a new product





export default router;
