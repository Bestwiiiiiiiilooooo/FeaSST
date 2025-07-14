import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},
    image: { type: String, required: true },
    category:{ type:String, required:true},
    promoCode: { type: String },
    promoDiscount: { type: Number },
    isAvailable: { type: Boolean, default: true }, // Track availability status
    sideDishes: [{ 
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String }
    }]
})

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;