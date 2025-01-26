import { Router } from "express"
import { verifyToken } from "../middleware/auth.js";
import { deleteMail, getEmails, registerEmail } from "../controller/token.js";

export const tokenRouter = Router();

tokenRouter.post("/register", verifyToken, registerEmail);
tokenRouter.get("/getEmails", verifyToken, getEmails);
tokenRouter.post("/deleteEmail", verifyToken, deleteMail);
