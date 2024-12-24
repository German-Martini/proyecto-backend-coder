import { Router } from 'express';
import { validate as isUuid } from 'uuid';
import { productService } from '../services/product.service.js';


export const productRoutes = Router();

productRoutes.get("/", async (req, res) => {
  const products = await productService.getAll();

  res.status(200).json(products);
});

productRoutes.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const product = await productService.getById({ id });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

productRoutes.post("/", async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;

  try {
    const product = await productService.create({ title, description, code, price, status, stock, category  });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

productRoutes.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const { title, content, description, code, price, status, stock, category } = req.body;

  try {
    const product = await productService.update({ id, title, content, description, code, price, status, stock, category });

    if (!product) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

productRoutes.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  } 

  try {
    const product = await productService.delete({ id });

    if (!product) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});




