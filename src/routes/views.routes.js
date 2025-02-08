import { Router } from "express";
import { productModel } from "../models/product.model.js";

export const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
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