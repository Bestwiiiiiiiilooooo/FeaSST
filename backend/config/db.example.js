require('dotenv').config();
const mongoose = require('mongoose');

// Example only! Do not put real credentials here.
await mongoose.connect(process.env.MONGODB_URI).then(() => console.log("DB Connected"));