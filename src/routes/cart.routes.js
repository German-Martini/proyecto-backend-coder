import { Router } from "express";
import { cartModel } from "../models/cart.model.js";

export const cartRoutes = Router();

cartRoutes.post("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await cartModel.findById(id);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el carrito" });
  }
}); 

cartRoutes.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await cartModel.findByIdAndUpdate(id, req.body);
    res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

cartRoutes.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await cartModel.findByIdAndDelete(id);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.status(200).json({ message: "Carrito eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el carrito" });
  }
});


cartRoutes.post("/:id/product/:productId", async (req, res) => {
  const { id, productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
  }

  try {
    
    const cart = await cartModel.findById(id);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    
    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex !== -1) {
      
      cart.products[productIndex].quantity += quantity;
    } else {
     
      cart.products.push({ productId, quantity });
    }

    
    await cart.save();

    res.status(200).json({ message: "Producto agregado al carrito", cart });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// const addProductToCart = async (cartId, productId, quantity) => {
//   try {
//     const cart = await cartModel.findById(cartId);

//     if (cart) {
//       const productIndex = cart.products.findIndex(
//         (p) => p.productId.toString() === productId.toString()
//       );

//       if (productIndex !== -1) {
//         cart.products[productIndex].quantity += quantity;
//       } else {
//         cart.products.push({ productId, quantity });
//       }

//       await cart.save();
//     } else {
//       const newCart = new cartModel({
//         products: [{ productId, quantity }],
//       });

//       await newCart.save();
//     }

//     console.log("Producto agregado al carrito con éxito.");
//   } catch (error) {
//     console.error("Error al agregar producto al carrito:", error);
//   }
// };

// cartRoutes.post("/", async (req, res) => {
//   try {
//     const newCart = new cartModel({ products: [] });
//     await newCart.save();
//     return res
//       .status(201)
//       .json({ message: "Carrito creado con éxito", cart: newCart });
//   } catch (error) {
//     console.error("Error al crear el carrito:", error);
//     return res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

// cartRoutes.post("/:cartId/products/:productId", async (req, res) => {
//   const { cartId, productId } = req.params;
//   const { quantity } = req.body;

//   if (!quantity || quantity <= 0) {
//     return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
//   }

//   try {
//     const cart = await cartModel.findById(cartId).populate("products.productId");
//     if (!cart) {
//       return res.status(404).json({ error: "Carrito no encontrado" });
//     }

//     // Buscamos si el producto ya está en el carrito
//     const productIndex = cart.products.findIndex(
//       (p) => p.productId._id.toString() === productId.toString()
//     );

//     if (productIndex !== -1) {
//       // Si ya está en el carrito, sumamos la cantidad
//       cart.products[productIndex].quantity += quantity;
//     } else {
//       // Si no está en el carrito, lo agregamos
//       cart.products.push({ productId, quantity });
//     }

//     await cart.save();

//     // Recargamos el carrito con populate para devolver los datos completos del producto
//     const updatedCart = await cartModel.findById(cartId).populate("products.productId");

//     return res.status(200).json({ message: "Producto agregado al carrito con éxito", updatedCart });
//   } catch (error) {
//     console.error("Error al agregar producto al carrito:", error);
//     return res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

// cartRoutes.put("/:cartId/products/:productId", async (req, res) => {
//   const { cartId, productId } = req.params;
//   const { quantity } = req.body;

//   if (!quantity || quantity <= 0) {
//     return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
//   }

//   try {
//     const cart = await cartModel.findById(cartId);
//     if (!cart) {
//       return res.status(404).json({ error: "Carrito no encontrado" });
//     }

//     const productIndex = cart.products.findIndex(
//       (p) => p.productId.toString() === productId.toString()
//     );
//     if (productIndex !== -1) {
//       cart.products[productIndex].quantity = quantity;
//       await cart.save();
//       return res.status(200).json(cart);
//     } else {
//       return res
//         .status(404)
//         .json({ error: "Producto no encontrado en el carrito" });
//     }
//   } catch (error) {
//     console.error("Error al actualizar la cantidad del producto:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// cartRoutes.delete("/:cartId/products/:productId", async (req, res) => {
//   const { cartId, productId } = req.params;

//   try {
//     const cart = await cartModel.findById(cartId);
//     if (!cart) {
//       return res.status(404).json({ error: "Carrito no encontrado" });
//     }

//     const updatedProducts = cart.products.filter(
//       (p) => p.productId.toString() !== productId.toString()
//     );
//     if (updatedProducts.length === cart.products.length) {
//       return res
//         .status(404)
//         .json({ error: "Producto no encontrado en el carrito" });
//     }

//     cart.products = updatedProducts;
//     await cart.save();
//     return res.status(200).json(cart);
//   } catch (error) {
//     console.error("Error al eliminar el producto del carrito:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// cartRoutes.delete("/:cartId", async (req, res) => {
//   const { cartId } = req.params;

//   try {
//     const cart = await cartModel.findByIdAndDelete(cartId);
//     if (!cart) {
//       return res.status(404).json({ error: "Carrito no encontrado" });
//     }
//     return res.status(200).json({ message: "Carrito eliminado con éxito" });
//   } catch (error) {
//     console.error("Error al eliminar el carrito:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });


