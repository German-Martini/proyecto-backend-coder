import express from "express";
import handlebars from "express-handlebars";
import Handlebars from "handlebars";
import mongoose from "mongoose";
import path from "path";
import cookieParser from 'cookie-parser';
import passport from "passport";
import { initializePassport } from "./utils/passport.config.js";
import { productRoutes } from "./routes/products.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { cartRoutes } from "./routes/cart.routes.js";
import { __dirname } from "./dirname.js";
import { userRoutes } from "./routes/user.routes.js";
import { connect } from "mongoose";

import { CONFIG } from "./config/config.js";

const app = express();
export const  COOKIE_SECRTA = "secret_cookie";



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRTA));
app.use(express.static(path.resolve(__dirname, "../public")));
initializePassport();
app.use(passport.initialize())


connect(CONFIG.MONGODB_URI)
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => {
    console.log("Error al acceder a la base de datos", error);
  });

  

  Handlebars.registerHelper("gt", function (a, b) {
    return a > b;
  });
  Handlebars.registerHelper("lt", (a, b) => a < b);
  Handlebars.registerHelper("add", (a, b) => a + b);
  Handlebars.registerHelper("subtract", (a, b) => a - b);

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    helpers: {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    gt: (a, b) => a > b,  
    lt: (a, b) => a < b   
    },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true, 
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));
app.engine("hbs", handlebars.engine({ extname: ".hbs" }));

app.use("/", viewsRouter);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);

const server = app.listen(CONFIG.PORT, () => {
  console.log(`Server is running on port http://localhost:${CONFIG.PORT}`);
});



app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});
console.log('MONGO_URI:', process.env.MONGO_URI);