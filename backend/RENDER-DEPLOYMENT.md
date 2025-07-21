# Backend Deployment to Render

## Prerequisites

1. MongoDB Atlas database (free tier available)
2. GitHub repository with your backend code

## Environment Variables Needed

Set these in Render dashboard:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secret key for JWT tokens (any random string)
- `PORT`: Render sets this automatically

## Render Configuration

1. **Build Command**: `npm install`
2. **Start Command**: `npm start`
3. **Root Directory**: Leave empty (if backend is root) or set to `backend` if in subfolder

## Deployment Steps

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure as above
5. Add environment variables
6. Deploy!

## After Deployment

Your backend will be available at: `https://your-app-name.onrender.com`

Update your frontend and admin `.env.production` files:
```
VITE_API_URL=https://your-app-name.onrender.com
```

Then rebuild and redeploy frontend/admin to Firebase. 