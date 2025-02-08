import { Schema, model } from "mongoose";
import { type } from "os";

const cartSchema = new Schema({
  products: {
    type: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 }, 
      }
    ],
    required: true,
    default: [{ productId: null, quantity: null }],
  }
  
   
 
});

export const cartModel = model("cart", cartSchema);