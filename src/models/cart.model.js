import { Schema, model } from "mongoose";


const cartSchema = new Schema({
  products: {
    type: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 }, 
      }
    ],  
    default: [],
  }
  
   
 
});

export const cartModel = model("cart", cartSchema);