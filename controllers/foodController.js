import foodModel from "../models/foodModel.js";
import fs from 'fs'

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
        fs.unlink(`uploads/${food.image}`, () => { })

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

export { listFood, addFood, removeFood, toggleAvailability }
