import { Router } from "express";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";


export const viewsRouter = Router();

viewsRouter.get("/products", async (req, res) => {
    try {
        const products = await productModel.find();
        res.render("home", { products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});
   

viewsRouter.get("/realtime", (req, res) => {
    res.render("realtimeProducts");
});



viewsRouter.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; 
    const options = {
      page: page,
      limit: limit,
    };
  
    try {
      const result = await productModel.paginate({}, options);
  
      res.render("home", {
        products: result.docs,   
        currentPage: page,      
        totalPages: result.totalPages, 
      });
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).send("Error en el servidor");
    }
  });
  

viewsRouter.get("/realtime", (req, res) => {
  res.render("realtimeProducts");
});



viewsRouter.get("/cart", async (req, res) => {
    try {
      const cart = await cartModel.findOne().populate({
        path: "products.productId",
        model: "Product",
    });
        res.render("cart", {
            cart,
            isEmpty: !cart || cart.products.length === 0, 
        });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send("Error en el servidor");
    }
});
