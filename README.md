# Food Delivery Backend API

Express.js backend API for the food delivery application.

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas database

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=4000
   ```

3. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

4. **Test the API:**
   Visit `http://localhost:4000` to see "API Working"

## 📋 API Endpoints

- `GET /` - Health check
- `POST /api/user/*` - User authentication and management
- `GET /api/food/list` - Get all food items
- `POST /api/food/*` - Food item management
- `POST /api/cart/*` - Shopping cart operations
- `POST /api/order/*` - Order management
- `GET /api/menu/*` - Menu operations

## 🌐 Deployment

### Render (Recommended)

1. Connect this repository to Render
2. Configure as a Web Service
3. Set environment variables in Render dashboard
4. Deploy!

See `RENDER-DEPLOYMENT.md` for detailed instructions.

### Other Platforms

This backend can be deployed to any Node.js hosting platform:
- Railway
- Heroku
- Vercel (with serverless functions)
- DigitalOcean App Platform

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `PORT` | Server port (set automatically by hosting platforms) | No |

## 📁 Project Structure

```
├── config/
│   ├── db.js          # Database connection
│   └── firebaseAdmin.js # Firebase admin config
├── controllers/
│   ├── userController.js
│   ├── foodController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/
│   ├── auth.js
│   └── firebaseAuth.js
├── models/
│   ├── userModel.js
│   ├── foodModel.js
│   └── orderModel.js
├── routes/
│   ├── userRoute.js
│   ├── foodRoute.js
│   ├── cartRoute.js
│   └── orderRoute.js
├── uploads/           # File uploads directory
├── server.js          # Main server file
├── package.json
└── README.md
```

## 🔒 Security

- CORS configured for frontend domains
- JWT token authentication
- Firebase Authentication integration
- Environment variables for sensitive data

## 📞 Support

For issues or questions, check the main project repository or create an issue here. 