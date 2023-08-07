import express from 'express'
import { Color, Size } from '../model/Model';
const router = express.Router();


// Fetch available sizes
router.get("/sizes", async (req, res) => {
  try {
    
    const sizes = await Size.find();

    res.status(200).json(sizes);
  } catch (error:any) {
    console.error("Error fetching sizes:", error);
    res
      .status(500)
      .json({message: "Error fetching sizes", error: error.message});
  }
});


// Fetch available colors
router.get("/colors", async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json(colors);
  } catch (error:any) {
    res.status(500).json({ message: "Error fetching colors", error: error.message });
  }
});








export default router;