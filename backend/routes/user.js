import { Router } from "express"

import { registerUser, loginUser } from "../controller/user.js";

export const userRouter = Router();

userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);
