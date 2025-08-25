import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//config variables
const currency = "usd";
const deliveryCharge = 5;
const frontend_URL = 'http://localhost:5173';

// Helper to generate a unique 3-digit order number
async function generateUniqueOrderNumber() {
  let orderNumber;
  let exists = true;
  while (exists) {
    orderNumber = Math.floor(100 + Math.random() * 900).toString(); // 3-digit
    exists = await orderModel.exists({ orderNumber });
  }
  return orderNumber;
}

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    try {
        // Only allow orders for the next day
        const now = new Date();
        const orderDate = new Date(req.body.orderDate);
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        if (orderDate < tomorrow) {
            return res.json({ success: false, message: "Orders must be placed at least one day in advance." });
        }
        const orderNumber = await generateUniqueOrderNumber();
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            orderNumber,
            stallId: req.body.stallId,
            collectedDate: orderDate,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }))

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Placing User Order for Frontend using stripe
const placeOrderCod = async (req, res) => {
    try {
        // Only allow orders for the next day
        const now = new Date();
        const orderDate = new Date(req.body.orderDate);
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        if (orderDate < tomorrow) {
            return res.json({ success: false, message: "Orders must be placed at least one day in advance." });
        }
        const orderNumber = await generateUniqueOrderNumber();
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
            orderNumber,
            stallId: req.body.stallId,
            collectedDate: orderDate,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {
            status: req.body.status,
            statusUpdatedAt: new Date(),
        });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }

}

const deleteOrder = async (req, res) => {
    try {
        await orderModel.findByIdAndDelete(req.body.orderId);
        res.json({ success: true, message: "Order deleted" });
    } catch (error) {
        res.json({ success: false, message: "Error deleting order" });
    }
}

const clearAllOrders = async (req, res) => {
    try {
        await orderModel.deleteMany({});
        res.json({ success: true, message: "All orders cleared" });
    } catch (error) {
        res.json({ success: false, message: "Error clearing all orders" });
    }
}

const listOrdersByStall = async (req, res) => {
    try {
        const { stallId } = req.params;
        const orders = await orderModel.find({ stallId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod, deleteOrder, clearAllOrders, listOrdersByStall }