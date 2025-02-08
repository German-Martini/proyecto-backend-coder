import { Router } from 'express';
import { productModel } from "../models/product.model.js";

export const productRoutes = Router();

productRoutes.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const products = await productModel.paginate(
      {}, 
      { page: Number(page), limit: Number(limit) }
    );
    

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





productRoutes.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el producto" });
  }
});

productRoutes.post("/", async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;

  if (!title || !description || !code || price == null || status == null || stock == null || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    const product = await productModel.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
    });
    res.status(201).json(product);
  } catch (error) {
    
    console.error("Error al crear el producto:", error);  
    return res.status(500).json({ error: error.message });
  }
});

productRoutes.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { title, description, code, price, status, stock, category } = req.body;
    const product = await productModel.findByIdAndUpdate(id,{title, description, code, price, status, stock, category})
    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

productRoutes.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el producto" });
  }
});




















