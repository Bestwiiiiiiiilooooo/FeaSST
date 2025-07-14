import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type:String,required:true},
    items: { type: Array, required:true},
    amount: { type: Number, required: true},
    address:{type:Object,required:true},
    status: {type:String,default:"Food Processing"},
    date: {type:Date,default:Date.now()},
    payment:{type:Boolean,default:false},
    orderNumber: { type: String, required: true, unique: true },
    statusUpdatedAt: { type: Date, default: Date.now },
    stallId: { type: String, required: true },
    collectedDate: { type: Date },
    collectionTime: { type: String }, // Store time in HH:MM format
})

// Valid statuses: 'Food Processing', 'Ready to Collect', 'Rejected'

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;