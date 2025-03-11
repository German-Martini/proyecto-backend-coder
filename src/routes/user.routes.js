import jwt from "jsonwebtoken";	
import passport from "passport";
import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.utils.js";
import {COOKIE_SECRTA} from "../server.js"
import { authenticateJWT } from "../utils/passport.config.js";


export const userRoutes = Router();


userRoutes.get("/cookies", (req, res) => {
  const token = jwt.sign(
    {
      id: "abcd",
      username: "test",
      role: "admin",
    },
    COOKIE_SECRTA,
    { expiresIn: "5m" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 900000,
  });

  res.json({ message: "Cookie enviada", token });
});


userRoutes.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const PasswordHash = await hashPassword(password);


    const user = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: PasswordHash,
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

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, COOKIE_SECRTA  , {
      expiresIn: "1h",
    }); 

    res.cookie("token", token, { httpOnly: true, maxAge: 900000, });
    res.json({message: "Login exitoso", token })
  } catch (error) {
    res.status(500).json({ error: "Error al autenticar" });
  }
}); 

userRoutes.post("/restorePassword", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const PasswordHash = await hashPassword(password);

    await userModel.updateOne({ _id: user._id }, { password: PasswordHash });

    res.redirect("/login");
  } catch (error) {
    res.status(500).json({ error: "Error al autenticar" });
  } 
});


userRoutes.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

userRoutes.get('/current', passport.authenticate('jwt', {session:false}),(req,res)=>{
  res.json({message: req.user})
})


userRoutes.get('/admin',passport.authenticate('jwt', {session:false}),(req,res)=>{
  res.json({message:'Acceso admin'})
} )

userRoutes.get('/profile', authenticateJWT, async (req, res) => {
  try {
      const user = await userModel.findOne({ email }).lean();

      if (!user) {
          return res.status(404).send('User not found');
      }

      res.render('profile', {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          age: user.age,
          cart_id: user.cart_id
      });
  } catch (error) {
      res.status(500).send('Server error');
  }
});