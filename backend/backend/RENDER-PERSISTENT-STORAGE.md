# Render Persistent Disk Storage Setup

This guide will help you set up Render's persistent disk storage to solve the image disappearing issue.

## Problem
Render's default file system is ephemeral, meaning files uploaded to the `uploads/` directory get deleted when the server restarts (which happens daily or during inactivity).

## Solution: Render Persistent Disk

Render offers persistent disk storage that survives server restarts and deployments.

## Step 1: Upgrade to Render Pro Plan

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Navigate to your backend service
3. Click on "Settings" tab
4. Under "Plan", upgrade to "Pro" plan ($7/month)
5. This enables persistent disk storage

## Step 2: Configure Persistent Disk

1. In your service settings, scroll down to "Disk" section
2. Click "Add Disk"
3. Configure:
   - **Name**: `uploads-disk`
   - **Mount Path**: `/opt/render/project/src/uploads`
   - **Size**: 1 GB (minimum, adjust as needed)
   - **Type**: SSD

## Step 3: Update Multer Configuration

Update your `backend/routes/foodRoute.js` to use the persistent disk path:

```javascript
import express from 'express';
import { addFood, listFood, removeFood, toggleAvailability } from '../controllers/foodController.js';
import multer from 'multer';
import path from 'path';

const foodRouter = express.Router();

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/uploads' 
  : 'uploads';

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

//Image Storage Engine (Saving Image to persistent uploads folder & rename it)
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage})

foodRouter.get("/list", listFood);
foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.post("/remove", removeFood);
foodRouter.post("/toggle-availability", toggleAvailability);

export default foodRouter;
```

## Step 4: Update Server Configuration

Update your `backend/server.js` to serve images from the persistent disk:

```javascript
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import foodRouter from './routes/foodRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import menuRouter from './routes/menuRoute.js';
import path from 'path';

// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// Configure uploads directory path
const uploadsDir = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/uploads' 
  : 'uploads';

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/food', foodRouter);
app.use('/images', express.static(uploadsDir));
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/menu', menuRouter);

app.get('/', (req, res) => {
  res.send('API Working');
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
```

## Step 5: Update Food Controller

Update your `backend/controllers/foodController.js` to use the correct path:

```javascript
import foodModel from "../models/foodModel.js";
import fs from 'fs'
import path from 'path';

// Configure uploads directory path
const uploadsDir = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/uploads' 
  : 'uploads';

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// add food
const addFood = async (req, res) => {
    try {
        let image_filename = `${req.file.filename}`

        // Parse side dishes if provided
        let sideDishes = [];
        if (req.body.sideDishes) {
            try {
                sideDishes = JSON.parse(req.body.sideDishes);
                // Ensure all side dish prices are numbers
                sideDishes = sideDishes.map(dish => ({
                    ...dish,
                    price: Number(dish.price)
                }));
            } catch (e) {
                console.log('Error parsing side dishes:', e);
            }
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
            promoCode: req.body.promoCode,
            promoDiscount: req.body.promoDiscount,
            sideDishes: sideDishes,
            isAvailable: true, // New items are available by default
        })

        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        const imagePath = path.join(uploadsDir, food.image);
        fs.unlink(imagePath, () => { })

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// toggle food availability
const toggleAvailability = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        const newAvailability = !food.isAvailable;
        await foodModel.findByIdAndUpdate(req.body.id, { isAvailable: newAvailability });

        const status = newAvailability ? "Available" : "Sold Out";
        res.json({ success: true, message: `Food marked as ${status}` });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { listFood, addFood, removeFood, toggleAvailability };
```

## Step 6: Deploy

1. Commit and push your changes to GitHub
2. Render will automatically redeploy your service
3. The persistent disk will be mounted and images will persist

## Step 7: Test

1. Upload a new food item through the admin panel
2. Check that the image displays correctly
3. Wait for the server to restart (or manually restart it)
4. Verify the image still displays after restart

## Cost Considerations

- Render Pro Plan: $7/month
- Additional disk storage: $0.25/GB/month
- For a typical food delivery app, total cost should be around $7-10/month

## Alternative Solutions (if you don't want to upgrade to Pro)

1. **Use Cloudinary** (free tier available)
2. **Use AWS S3** (pay-per-use, very cheap)
3. **Use Google Cloud Storage** (pay-per-use)
4. **Use Firebase Storage** (free tier available)

## Migration from Existing Images

If you have existing images that disappeared:

1. You'll need to re-upload them through the admin panel
2. The new images will be stored on the persistent disk
3. They will survive server restarts

## Troubleshooting

### Images still not showing:
1. Check that the persistent disk is properly mounted
2. Verify the mount path in Render dashboard
3. Check server logs for any errors

### Permission issues:
1. The persistent disk should have proper permissions
2. If issues persist, contact Render support

### Disk full:
1. Monitor disk usage in Render dashboard
2. Consider increasing disk size
3. Implement image cleanup for deleted items 