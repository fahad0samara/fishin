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
const sanitizeFileName = (fileName: string) => {
  return fileName.replace(/[^a-zA-Z0-9-_.]/g, "").replace(/\s+/g, "_");

 
};



router.post("/add", upload.array("images", 5), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({error: "No files uploaded"});
    }

    const compressedImages = await Promise.all(
      files.map<Promise<Buffer>>(async file => {
        return await sharp(file.buffer)
          .resize(500, 500)
          .jpeg({quality: 80})
          .toBuffer();
      })
    );

    const uploadedImageURLs = await Promise.all(
      compressedImages.map<Promise<string>>(async (compressedImage, index) => {
        const sanitizedFileName = sanitizeFileName(files[index].originalname); 
        console.log("Sanitized Filename:", sanitizedFileName); 
        const filename = `${sanitizedFileName}-${Date.now()}`;
        
        const blockBlobClient = containerClient.getBlockBlobClient(filename);
        await blockBlobClient.upload(compressedImage, compressedImage.length);
        return blockBlobClient.url;
      })
    );

    const newProduct = new Product({
      ...req.body,
      image: uploadedImageURLs[0],
      image_url: uploadedImageURLs[0],
      images: uploadedImageURLs,
    });
  
  

    await newProduct.save();

    res.status(201).json(newProduct);
    
  } catch (error) {
    console.error(error);
    res.status(400).json({message: "Error creating product"});
  }
});




// Get all products with pagination
// Get all products with pagination
router.get("/get", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1; // Get the requested page number from query
  const limit = parseInt(req.query.limit as string) || 10; // Get the requested limit from query

  try {
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find()
      .populate("category colors sizes")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ products, currentPage: page, totalPages });
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

router.put(
  "/update/:productId",
  upload.array("images", 5),
  async (req, res) => {
    console.log(
      "Request body:",
      req.body,
    );
    
    try {
      const productId = req.params.productId;
      const updatedData = req.body;

      // Check if any files were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({error: "No files uploaded"});
      }

      // Fetch the existing product
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({message: "Product not found"});
      }

      // Delete images from Azure Blob Storage
      const imageUrls = existingProduct.images;
 await Promise.all(
   imageUrls.map(async imageUrl => {
     try {
       const blobName = imageUrl.split("/").slice(-1)[0];
       const blockBlobClient =
         containerClient.getBlockBlobClient(blobName);
       await blockBlobClient.delete();
       console.log(`Deleted ${imageUrl}`);
           console.log("Blob deleted:", blobName);
     
   

 
     } catch (error) {
       console.error("Error deleting blob:", imageUrl, error);
     }
   })
 );



      



      // Update the product in DB and update its images on Azure Blob storage
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        const compressedImages = await Promise.all(
          files.map<Promise<Buffer>>(async file => {
            return await sharp(file.buffer)
              .resize(500, 500)
              .jpeg({quality: 80})
              .toBuffer();
          })
        );

        const uploadedImageURLs = await Promise.all(
          compressedImages.map<Promise<string>>(
            async (compressedImage, index) => {
              const sanitizedFileName = sanitizeFileName(
                files[index].originalname
              );
              const filename = `${sanitizedFileName}-${Date.now()}`;
              const blockBlobClient =
                containerClient.getBlockBlobClient(filename);
              await blockBlobClient.upload(
                compressedImage,
                compressedImage.length
              );
              return blockBlobClient.url;
            }
          )
        );

        updatedData.image = uploadedImageURLs[0];
        updatedData.image_url = uploadedImageURLs[0];
        updatedData.images = uploadedImageURLs;
      }

      // Update the product data in the database
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updatedData,
        {new: true}
      ).populate("category colors sizes");

      res.status(200).json(updatedProduct);
    
    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Error updating product"});
    }
  }
);


    

    



 


    



      


 





router.delete("/delete/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({message: "Product not found"});
    }

    // Delete images from Azure Blob Storage
    const imageUrls = product.images;

    await Promise.all(
      imageUrls.map(async imageUrl => {
        const blobName = imageUrl.split("/").pop(); // Extract the blob name from the URL
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.delete();
      })
    );

    // Delete the product from the database
    await Product.deleteOne({_id: req.params.productId});

    res.status(200).json({message: "Product and images deleted successfully"});
  } catch (error) {
    res.status(500).json({message: "Error deleting product"});
  }
});








export default router;
