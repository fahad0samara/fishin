import express from 'express'
import { Category } from '../model/Model';
const router = express.Router();



router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error:any) {
    res
      .status(500)
      .json({message: "Error fetching categories", error: error.message});
  }
});


//GET Single Category:
router.get("/categories/:categoryId", async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({message: "Category not found"});
    }
    res.status(200).json(category);
  } catch (error:any) {
    res
      .status(500)
      .json({message: "Error fetching category", error: error.message});
  }
});

//POST New Category
router.post("/categories", async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error:any) {
    res
      .status(500)
      .json({message: "Error creating category", error: error.message});
  }
});

//PUT (Update) Category:
router.put("/categories/:categoryId", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      {new: true}
    );
    if (!updatedCategory) {
      return res.status(404).json({message: "Category not found"});
    }
    res.status(200).json(updatedCategory);
  } catch (error:any) {
    res
      .status(500)
      .json({message: "Error updating category", error: error.message});
  }
});


//DELETE Category
router.delete("/categories/:categoryId", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(
      req.params.categoryId
    );
    if (!deletedCategory) {
      return res.status(404).json({message: "Category not found"});
    }
    res.status(204).send();
  } catch (error:any) {
    res
      .status(500)
      .json({message: "Error deleting category", error: error.message});
  }
});






export default router;