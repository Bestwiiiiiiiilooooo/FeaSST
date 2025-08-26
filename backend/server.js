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
const port = process.env.PORT || 10000;

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
    'https://feasst-food.firebaseapp.com',
    'https://feasst-food-admin.web.app'  // Admin panel domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Other middlewares
app.use(express.json({ limit: '10mb' })); // Limit request body size

// Add debugging middleware to log all requests BEFORE routes
app.use((req, res, next) => {
  console.log(`🚨 REQUEST LOG: ${req.method} ${req.originalUrl}`);
  console.log(`🚨 REQUEST LOG: Headers:`, req.headers);
  next();
});

// Apply rate limiting ONLY to specific endpoints that need protection
app.use('/api/user/login', authLimiter);
app.use('/api/user/register', authLimiter);
app.use('/api/user', generalLimiter); // Only protect user routes
app.use('/api/cart', generalLimiter); // Only protect cart routes
app.use('/api/order', generalLimiter); // Only protect order routes

// db connection
console.log('🚨 SERVER: Connecting to database...');
connectDB();

// api endpoints (no rate limiting on menu and food routes)
console.log('🚨 SERVER: Registering API routes...');
app.use('/api/user', userRouter);
console.log('🚨 SERVER: User routes registered');
app.use('/api/food', foodRouter);
console.log('🚨 SERVER: Food routes registered');
app.use('/images', express.static('uploads'));
console.log('🚨 SERVER: Static images route registered');
app.use('/api/cart', cartRouter);
console.log('🚨 SERVER: Cart routes registered');
app.use('/api/order', orderRouter);
console.log('🚨 SERVER: Order routes registered');
app.use('/api/menu', menuRouter);
console.log('🚨 SERVER: Menu routes registered');
console.log('🚨 SERVER: All routes registered successfully!');

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

app.listen(port, () => {
  console.log(`🚨 SERVER: Starting on port ${port}`);
  console.log(`🚨 SERVER: Environment: ${process.env.NODE_ENV}`);
  console.log(`🚨 SERVER: Render: ${process.env.RENDER ? 'YES' : 'NO'}`);
  console.log(`🚨 SERVER: Available at: http://localhost:${port}`);
});