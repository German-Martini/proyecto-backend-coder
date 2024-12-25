import { Router } from 'express';
import { v4 as uuid } from "uuid";
import { validate as isUuid } from 'uuid';
import { cartService } from '../services/cart.services.js';

export const cartRoutes = Router();

cartRoutes.post("/", async (req, res) => {
    try {
      const newCart = await cartService.create();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  cartRoutes.get("/:cid", async (req, res) => {
    const { cid } = req.params;
  
    try {
      const cart = await cartService.getById({ id: cid });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.status(200).json(cart.products);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  cartRoutes.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
  
    
    try {
      const updatedCart = await cartService.addProduct({ cartId: cid, productId: pid });
      if (!updatedCart) {
        return res.status(404).json({ message: "Cart or product not found" });
      }
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });