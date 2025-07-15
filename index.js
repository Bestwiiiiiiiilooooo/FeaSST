import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import foodRouter from './routes/foodRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import menuRouter from './routes/menuRoute.js';
import { onRequest } from 'firebase-functions/v2/https';

// app config
const app = express();

// middlewares
app.use(express.json());
app.use(cors({
  origin: [
    'https://proj-serve.web.app',
    'https://proj-serve.firebaseapp.com',
    'https://proj-serve-admin.web.app',
    'https://proj-serve-admin.firebaseapp.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ],
  credentials: true
}));

// db connection
connectDB();

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/menu', menuRouter);

app.get('/', (req, res) => {
  res.send('API Working');
});

// Export the Express app as a Firebase Function
export const api = onRequest({
  region: 'us-central1',
  maxInstances: 10
}, app); 