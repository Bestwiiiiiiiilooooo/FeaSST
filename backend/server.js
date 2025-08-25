import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import foodRouter from './routes/foodRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import menuRouter from './routes/menuRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000;

// Security middleware
app.use(helmet());

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for general endpoints
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS middleware - MUST come before routes
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:10000',
    'https://feasst-food.web.app',
    'https://feasst-food.firebaseapp.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Other middlewares
app.use(express.json({ limit: '10mb' })); // Limit request body size
// Apply rate limiting ONLY to specific endpoints that need protection
app.use('/api/user/login', authLimiter);
app.use('/api/user/register', authLimiter);
app.use('/api/user', generalLimiter); // Only protect user routes
app.use('/api/cart', generalLimiter); // Only protect cart routes
app.use('/api/order', generalLimiter); // Only protect order routes

// db connection
connectDB();

// api endpoints (no rate limiting on menu and food routes)
app.use('/api/user', userRouter);
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/menu', menuRouter);

app.get('/', (req, res) => {
  res.send('API Working');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));