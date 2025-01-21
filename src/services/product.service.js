import fs from "node:fs";
import { v4 as uuid } from "uuid";


class ProductService {
  path;
  products = [];

  
  constructor({ path }) {
    this.path = path

    if (fs.existsSync(this.path)) {
      try {

        const data = fs.readFileSync(this.path, "utf-8");
        this.products = JSON.parse(data);
      } catch (error) {
        this.products = []
      }
    } else {
      this.products = []
    }
  }


  async getAll() {
    return this.products;
  }


  async getById({ id }) {
    const  products = this.products.find((products) => products.id === id);
    return products;
  }

  async create({ title, description, code, price, status, stock, category}) {
    const id = uuid();

    const products = {
      id,
      title,
      description, 
      code, 
      price, 
      status, 
      stock, 
      category
    };

    this.products.push(products);

    try {
      await this.saveOnFile();

      io.emit("productAdded", products);

      return products;
    } catch (error) {
      console.log(error);

      console.error("Error al guardar el archivo");
    }
  }

  async update({ id, title, content, description, code, price, status, stock, category  }) {
    const products = this.products.find((products) => products.id === id);

    if (!products) {
      return null;
    }

    products.title = title ?? products.title;
    products.description = description ?? products.description;
    products.code = code ?? products.code;
    products.price = price ?? products.price;
    products.status = status ?? products.status;
    products.stock = stock ?? products.stock;
    products.category = category ?? products.category;

    const index = this.products.findIndex((products) => products.id === id);

    this.products[index] = products;

    try {
      await this.saveOnFile();

      return products;
    } catch (error) {
      console.error("Error al actualizar el archivo");
    }
  }

  async delete({ id }) {
    const products = this.products.find((products) => products.id === id);

    if (!products) {
      return null;
    }

    const index = this.products.findIndex((products) => products.id === id);

    this.products.splice(index, 1);

    try {
      await this.saveOnFile();

      return products;
    } catch (error) {
      console.error("Error al eliminar el archivo");
    }
  }

  async saveOnFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      console.log(error);

      console.error("Error al guardar el archivo");
    }
  }
}


export const productService = new ProductService({
  path: "./src/db/product.json",
});