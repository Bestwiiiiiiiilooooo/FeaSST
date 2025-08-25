# 🚀 Hosting Setup Guide

## Making Google Authentication Work When Hosted

### Step 1: Add Authorized Domains to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `proj-serve`
3. Click **Authentication** → **Settings** → **Authorized domains**
4. Add these domains:
   - `feasst-food.web.app`
   - `feasst-food-admin.web.app`
   - `proj-serve.web.app`
   - `proj-serve-admin.web.app`
   - `localhost` (for development)

### Step 2: Deploy Your Backend

You need to deploy your backend to a hosting service. Recommended options:

#### Option A: Render (Recommended)
1. Go to [Render](https://render.com/)
2. Connect your GitHub repository
3. Create a new Web Service
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Get your backend URL (e.g., `https://your-app.onrender.com`)

#### Option B: Railway
1. Go to [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Deploy your backend
4. Get your backend URL

### Step 3: Update Backend URL

1. Open `src/Context/StoreContext.jsx`
2. Find this line:
   ```javascript
   const productionUrl = 'https://your-backend-url.onrender.com';
   ```
3. Replace with your actual backend URL

### Step 4: Deploy Frontend

Run the deployment script:
```bash
./deploy-to-firebase.sh
```

Or manually:
```bash
npm run build
firebase deploy --only hosting:feasst-food
```

### Step 5: Test Authentication

1. Visit your deployed app: `https://feasst-food.web.app`
2. Try Google login
3. It should work without the "unauthorized-domain" error

### Troubleshooting

#### Still getting "auth/unauthorized-domain"?
- Double-check that you added the correct domain to Firebase
- Wait a few minutes for changes to propagate
- Clear browser cache and try again

#### Backend connection issues?
- Verify your backend URL is correct
- Check that your backend is running
- Ensure CORS is properly configured

#### Google login not working?
- Check browser console for errors
- Verify Firebase configuration is correct
- Make sure you're using the right Firebase project

### Environment Variables (Optional)

For better configuration management, you can create environment files:

1. Create `.env.local` for development:
   ```
   VITE_API_URL=http://localhost:4000
   ```

2. Create `.env.production` for production:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

### Security Notes

- Never commit API keys or sensitive data to your repository
- Use environment variables for configuration
- Enable HTTPS for production
- Regularly update dependencies

### Support

If you're still having issues:
1. Check the browser console for errors
2. Verify all domains are added to Firebase
3. Ensure your backend is accessible
4. Test with a different browser 