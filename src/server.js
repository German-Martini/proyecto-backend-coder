import express from 'express';
import { productRoutes } from './routes/products.routes.js';
import { cartRoutes } from './routes/cart.routes.js';


const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});