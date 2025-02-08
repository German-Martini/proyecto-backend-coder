import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import path from "path";
import { productRoutes } from "./routes/products.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { cartRoutes } from "./routes/cart.routes.js";
import { productModel } from "./models/product.model.js";
import { __dirname } from "./dirname.js";
import { Server } from "socket.io";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, "../public")));

mongoose.connect("mongodb+srv://German:Germancoder@cluster0.6uioh.mongodb.net/")
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => {
    console.log("Error al acceder a la base de datos", error);
  });

app.engine("hbs", handlebars.engine({ extname: "hbs", defaultLayout: "main" }));
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));

app.use("/", viewsRouter);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("A new user connected", socket.id);

  try{
  const products = await productModel.find();
  socket.emit("init", products);
  }catch(error){
    console.log(error);
  }
  socket.on("addProduct", async (newProduct) => {

    try{
      const product = await productModel.create(newProduct);
      io.emit("newProduct", product);
    } catch(error){
      console.log(error);
    }
  });
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});