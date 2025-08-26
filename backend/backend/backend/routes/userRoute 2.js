import express from 'express';
import { loginUser, registerUser, findOrCreateUser } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/findOrCreate", findOrCreateUser);

export default userRouter;