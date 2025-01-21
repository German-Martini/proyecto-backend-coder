import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { productRoutes } from './routes/products.routes.js';
import { viewsRouter } from './routes/views.routes.js';
import { cartRoutes } from './routes/cart.routes.js';
import { productService } from './services/product.service.js';
import {__dirname} from './dirname.js';
import { Server } from 'socket.io';



const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, '../public')));


app.engine('hbs', handlebars.engine({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, './views'));


app.use('/', viewsRouter);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


const server = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

export const io = new Server(server); 

io.on('connection', async (socket) => {
    console.log('A new user connected', socket.id);

    const products = await productService.getAll();
    socket.emit('init', products);

    socket.on('addProduct', async (newProduct) => {
        const product = await productService.create(newProduct);
        io.emit('newProduct', product);
    });
});

