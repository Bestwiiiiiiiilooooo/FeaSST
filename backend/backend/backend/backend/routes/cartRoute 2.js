import express from 'express';
import { addToCart, getCart, removeFromCart, clearCart } from '../controllers/cartController.js';
import firebaseAuth from '../middleware/firebaseAuth.js';

const cartRouter = express.Router();

cartRouter.post("/get", firebaseAuth, getCart);
cartRouter.post("/add", firebaseAuth, addToCart);
cartRouter.post("/remove", firebaseAuth, removeFromCart);
cartRouter.post("/clear", firebaseAuth, clearCart);

export default cartRouter;