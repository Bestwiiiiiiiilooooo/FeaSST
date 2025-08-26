import express from 'express';
import firebaseAuth from '../middleware/firebaseAuth.js';
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, placeOrderCod, deleteOrder, clearAllOrders, listOrdersByStall } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get("/list", listOrders);
orderRouter.post("/userorders", firebaseAuth, userOrders);
orderRouter.post("/place", firebaseAuth, placeOrder);
orderRouter.post("/status", updateStatus);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/placecod", firebaseAuth, placeOrderCod);
orderRouter.post("/delete", deleteOrder);
orderRouter.post("/clearall", clearAllOrders);
orderRouter.get("/listbystall/:stallId", listOrdersByStall);

export default orderRouter;