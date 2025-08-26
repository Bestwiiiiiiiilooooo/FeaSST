# Coolify Image Storage Guide

This guide covers different approaches to store images on Coolify for your food delivery application.

## 🏗️ Architecture Overview

Your application currently stores images in an `uploads/` directory. On Coolify, you have several options:

1. **Persistent Volumes** (Recommended)
2. **External Storage Services** (Cloudinary, AWS S3, etc.)
3. **Database Storage** (Base64 encoding)

## 📋 Option 1: Persistent Volumes (Recommended)

### Step 1: Configure Persistent Volume in Coolify

1. In your Coolify dashboard, go to your application
2. Navigate to the "Resources" or "Volumes" section
3. Add a new persistent volume:
   - **Name**: `uploads-volume`
   - **Mount Path**: `/app/uploads`
   - **Size**: 1-5 GB (depending on your needs)

### Step 2: Environment Variables

Add these environment variables in your Coolify application settings:

```bash
NODE_ENV=production
COOLIFY_UPLOADS_PATH=/app/uploads
```

### Step 3: Update Your Code

The code has been updated to support Coolify persistent volumes. The key changes:

- **Dynamic path configuration** based on environment
- **Automatic directory creation** if it doesn't exist
- **Environment variable support** for custom paths

### Step 4: Deploy

1. Commit and push your changes to your repository
2. Coolify will automatically redeploy your application
3. The persistent volume will be mounted and images will persist

## 📋 Option 2: External Storage Services

### Cloudinary (Recommended for external storage)

#### Step 1: Install Cloudinary

```bash
npm install cloudinary multer-storage-cloudinary
```

#### Step 2: Create Cloudinary Configuration

Create `backend/config/cloudinary.js`:

```javascript
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'feasst-food',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});

export default storage;
```

#### Step 3: Update Food Route

Update `backend/routes/foodRoute.js`:

```javascript
import express from 'express';
import { addFood, listFood, removeFood, toggleAvailability } from '../controllers/foodController.js';
import multer from 'multer';
import cloudinaryStorage from '../config/cloudinary.js';

const foodRouter = express.Router();

const upload = multer({ storage: cloudinaryStorage });

foodRouter.get("/list", listFood);
foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.post("/remove", removeFood);
foodRouter.post("/toggle-availability", toggleAvailability);

export default foodRouter;
```

#### Step 4: Update Food Controller

Update `backend/controllers/foodController.js`:

```javascript
import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from 'cloudinary';

// add food
const addFood = async (req, res) => {
    try {
        let image_url = req.file.path; // Cloudinary URL

        // Parse side dishes if provided
        let sideDishes = [];
        if (req.body.sideDishes) {
            try {
                sideDishes = JSON.parse(req.body.sideDishes);
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
            image: image_url, // Store Cloudinary URL
            promoCode: req.body.promoCode,
            promoDiscount: req.body.promoDiscount,
            sideDishes: sideDishes,
            isAvailable: true,
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
        
        // Delete from Cloudinary if it's a Cloudinary URL
        if (food.image && food.image.includes('cloudinary')) {
            const publicId = food.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { listFood, addFood, removeFood, toggleAvailability };
```

#### Step 5: Environment Variables

Add these to your Coolify environment variables:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📋 Option 3: AWS S3

### Step 1: Install AWS SDK

```bash
npm install aws-sdk multer-s3
```

### Step 2: Create S3 Configuration

Create `backend/config/s3.js`:

```javascript
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, `feasst-food/${Date.now()}-${file.originalname}`);
  }
});

export default storage;
```

### Step 3: Environment Variables

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

## 🔧 Coolify-Specific Configuration

### Dockerfile Considerations

If you're using a custom Dockerfile, ensure it creates the uploads directory:

```dockerfile
# Create uploads directory
RUN mkdir -p /app/uploads
RUN chmod 755 /app/uploads
```

### Health Checks

Add a health check endpoint to verify image serving:

```javascript
// In your server.js
app.get('/health/images', (req, res) => {
  const uploadsDir = getUploadsDir();
  if (fs.existsSync(uploadsDir)) {
    res.json({ status: 'healthy', uploadsPath: uploadsDir });
  } else {
    res.status(500).json({ status: 'unhealthy', error: 'Uploads directory not found' });
  }
});
```

## 🚀 Deployment Checklist

### For Persistent Volumes:

1. ✅ Configure persistent volume in Coolify
2. ✅ Set environment variables
3. ✅ Update code to use dynamic paths
4. ✅ Test image upload functionality
5. ✅ Verify images persist after container restart

### For External Storage:

1. ✅ Set up Cloudinary/AWS S3 account
2. ✅ Configure environment variables
3. ✅ Update code to use external storage
4. ✅ Test image upload and retrieval
5. ✅ Verify image deletion works

## 💰 Cost Considerations

### Persistent Volumes:
- Coolify storage costs depend on your hosting provider
- Typically $0.10-0.50 per GB/month

### Cloudinary:
- Free tier: 25 GB storage, 25 GB bandwidth
- Paid plans start at $89/month

### AWS S3:
- $0.023 per GB/month
- Data transfer costs apply

## 🔍 Troubleshooting

### Images not showing:
1. Check persistent volume mount in Coolify dashboard
2. Verify environment variables are set correctly
3. Check application logs for errors
4. Verify uploads directory exists and has proper permissions

### Permission issues:
1. Ensure the application has write permissions to the uploads directory
2. Check Coolify volume mount permissions
3. Verify Docker container user permissions

### Storage full:
1. Monitor storage usage in Coolify dashboard
2. Implement image cleanup for deleted items
3. Consider image compression
4. Set up storage alerts

## 📊 Monitoring

### Add logging to track image operations:

```javascript
// In foodController.js
const addFood = async (req, res) => {
    try {
        console.log('Uploading image:', req.file.filename);
        console.log('Uploads directory:', uploadsDir);
        // ... rest of the code
    } catch (error) {
        console.error('Image upload error:', error);
        res.json({ success: false, message: "Error" })
    }
}
```

## 🔄 Migration from Existing Setup

If you're migrating from Render or another platform:

1. **Backup existing images** before migration
2. **Update environment variables** in Coolify
3. **Test image upload** functionality
4. **Verify image serving** works correctly
5. **Monitor for any issues** during the first few days

## 📝 Best Practices

1. **Image optimization**: Compress images before storage
2. **File type validation**: Only allow specific image formats
3. **Size limits**: Set reasonable file size limits
4. **Backup strategy**: Regular backups of important images
5. **Cleanup routine**: Remove orphaned images periodically
6. **CDN integration**: Consider using a CDN for better performance

This setup will ensure your images are properly stored and served on Coolify, whether you choose persistent volumes or external storage services. 