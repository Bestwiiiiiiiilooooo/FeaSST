# Firestore Security Rules Setup


## Solution Options

### Option 1: Deploy Security Rules (Recommended)

Since Firestore is enabled in your project, deploy the security rules to prevent unauthorized access:

1. **Deploy the simple rules (recommended for your setup):**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Or use the comprehensive rules if you plan to use Firestore later:**
   ```bash
   # Copy the comprehensive rules to firestore.rules
   cp firestore.rules firestore-simple.rules
   firebase deploy --only firestore:rules
   ```

### Option 2: Disable Firestore (Alternative)

If you don't plan to use Firestore at all:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `proj-serve`
3. Go to **Firestore Database**
4. Click **Settings** (gear icon)
5. Click **Delete database**
6. Confirm deletion

## Quick Deployment Steps

### Step 1: Choose Your Rules File

**For your current setup (MongoDB only):**
```bash
# Use the simple rules that deny all access
cp firestore-simple.rules firestore.rules
```

**For future Firestore usage:**
```bash
# Use the comprehensive rules
# (firestore.rules is already the comprehensive version)
```

### Step 2: Deploy Rules

```bash
# Make sure you're in the project root directory
cd /Users/BrightonTan/Documents/food-del\ 3

# Deploy the rules
firebase deploy --only firestore:rules
```

### Step 3: Verify Deployment

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `proj-serve`
3. Go to **Firestore Database** → **Rules**
4. You should see your deployed rules

## Understanding the Rules

### Simple Rules (firestore-simple.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Deny all access since you use MongoDB
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Comprehensive Rules (firestore.rules)
These rules provide proper security if you decide to use Firestore:

- **Users**: Can only access their own data
- **Food Items**: Anyone can read, only admins can modify
- **Orders**: Users can access their own orders, admins can see all
- **Cart**: Users can only access their own cart
- **Admin Functions**: Only admin emails can perform admin actions

## Customization

### Update Admin Emails
In `firestore.rules`, update the admin emails:
```javascript
function isAdmin() {
  return isAuthenticated() && 
    request.auth.token.email in ['your-actual-admin@email.com'];
}
```

### Add Custom Collections
If you add new Firestore collections, add rules for them:
```javascript
match /yourNewCollection/{docId} {
  allow read, write: if isAuthenticated();
}
```

## Troubleshooting

### Deployment Fails
```bash
# Check if you're logged into Firebase
firebase login

# Check your project
firebase projects:list

# Set the correct project
firebase use proj-serve
```

### Rules Not Working
1. Check Firebase Console for syntax errors
2. Use Firebase Emulator to test rules locally
3. Check the Firebase Console logs for rule evaluation

### Still Getting Warnings
- Wait 24 hours for Firebase to re-evaluate your rules
- Check that the rules were deployed successfully
- Verify you're using the correct Firebase project

## Next Steps

1. **Deploy the rules** using the commands above
2. **Test your app** to ensure it still works
3. **Monitor Firebase Console** for any issues
4. **Consider migrating to Firestore** in the future for better integration

## Migration to Firestore (Future)

If you want to use Firestore instead of MongoDB:

1. Update your backend to use Firestore SDK
2. Migrate your data from MongoDB to Firestore
3. Update your frontend to use Firestore
4. Use the comprehensive security rules

## Support

If you encounter issues:
1. Check Firebase Console logs
2. Verify your Firebase project configuration
3. Test rules in Firebase Emulator
4. Check Firebase documentation for rule syntax 