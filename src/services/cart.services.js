import fs from "node:fs";
import { v4 as uuid } from "uuid";

class CartService {
  path;
  carts = [];

  constructor({ path }) {
    this.path = path;
    if (fs.existsSync(this.path)) {
      try {
        const data = fs.readFileSync(this.path, "utf-8");
        this.carts = JSON.parse(data);
      } catch (error) {
        console.error("Error al leer el archivo", error);
        this.carts = [];
      }
    } else {
      this.carts = [];
    }
  }



  async getById({ id }) {
    if (!id) {
      console.log("ID is required");
    }

    const cart = this.carts.find((cart) => cart.id === id);
    if (!cart) {
      console.log("Cart not found");
    }

    return cart;
  }

  async create() {
    const id = uuid();
    const cart = {
      id,
      products: [],
    };

    this.carts.push(cart);

    try {
      await this.saveOnFile();
      return cart;
    } catch (error) {
      console.error("Error al guardar el archivo", error);
      console.log("Could not create the cart");
    }
  }

  async addProduct({ cartId, productId }) {
    if (!cartId || !productId) {
      console.log("Both cartId and productId are required");
      return null 
    }

    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) {
      console.log("Cart not found");
      return null
    }

    const existingProduct = cart.products.find((p) => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    try {
      await this.saveOnFile();
      return cart;
    } catch (error) {
      console.error(error);
      console.log("Could not update the cart");
      return null
    }
  }

  async saveOnFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2)
      );
    } catch (error) {
      console.error(error);
      console.log("Could not save the file");
    }
  }
}

export const cartService = new CartService({
  path: "./src/db/cart.json",
});