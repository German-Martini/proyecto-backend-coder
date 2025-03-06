import { Router } from "express";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";


export const viewsRouter = Router();


   
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

viewsRouter.get("/signUp", async (req, res) => {
  res.render("signUp");
});

viewsRouter.get("/signIn", async (req, res) => {
  res.render("signIn");
});

viewsRouter.get("/profile", async (req, res) => {
  res.render("profile");
}); 