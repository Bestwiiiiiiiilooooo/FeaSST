import express from 'express';
import { loginUser, registerUser, findOrCreateUser, getAllowedDomains } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/findOrCreate", findOrCreateUser);
userRouter.get("/allowed-domains", getAllowedDomains);

export default userRouter;