import jwt from "jsonwebtoken";	
import { Router } from "express";
import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/password.utils.js";
// import { hashPassword, comparePassword } from "../utils/password.utils.js";

export const userRoutes = Router();
const secret = "secret";

userRoutes.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    req.body.password = hashPassword;   

    const user = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
    });

    res.status(201).json({message:"usuario creado exitosamente", user});
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});

userRoutes.get('/users', async (req, res) => {
  try {
    const users = await userModel.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

userRoutes.put("/users/:id", async (req, res) => {
 try {
    
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {new: true});

    res.status(200).json(user); 

 } catch (error) {
    
    res.status(500).json({ error: "Error al actualizar el usuario" });
 }
})

userRoutes.delete("/users/:id", async (req, res) => {
 try {
    
    const user = await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({messge:"usuario eliminado exitosamente", user});
 } catch (error) {
    
    res.status(400).json({ error: "Error al eliminar el usuario" });
 }
})


userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const user = await userModel.findOne({ email }).lean();

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, secret, {
      expiresIn: "1h",
    }); 

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Error al autenticar" });
  }
}); 