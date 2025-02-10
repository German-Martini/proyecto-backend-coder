import { Router } from "express";
import { productModel } from "../models/product.model.js";
import { cartModel } from "../models/cart.model.js";

export const cartRoutes = Router();

cartRoutes.post("/", async (req, res) => {
  try {
    const cart = await cartModel.create({ products: [] });
    res.status(201).json(cart);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el carrito" });
  }
});


cartRoutes.post("/:cartId/products", async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: "Debe enviar productId y quantity mayor a 0" });
    }

   
    let cart = await cartModel.findById(cartId).populate("products.productId"); // 🚀 Usamos populate

    if (!cart) {

      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    
    const productExists = await productModel.findById(productId);
    if (!productExists) {
     
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    

    const productIndex = cart.products.findIndex((p) => p.productId._id.toString() === productId);
    
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    
    
    cart = await cartModel.findById(cartId).populate("products.productId");

    

    res.status(200).json(cart);
  } catch (error) {

    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

cartRoutes.put("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

   
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }

   
    const cart = await cartModel.findById(cartId);
    if (!cart) {
    
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

  
    const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
    if (productIndex === -1) {

      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }


    cart.products[productIndex].quantity = quantity;

    await cart.save();


    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito" });
  }
});

cartRoutes.delete("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

   
    cart.products.splice(productIndex, 1);

    await cart.save();
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto del carrito" });
  }
});

cartRoutes.delete("/:cartId/products", async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    cart.products = [];

    await cart.save();
  
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar todos los productos del carrito" });
  }
});

