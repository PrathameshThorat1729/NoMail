import express from "express";
import { userRouter } from "./routes/user.js";
import { tokenRouter } from "./routes/token.js";
import cors from "cors";

const app = express();
const port = process.env.PORT | 8080;

app.use(cors({
  origin: "*"
}))
app.use(express.json());
app.use((err, _, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.json({ status: false, message: "Invalid data syntax" }); // Bad request
  }
  next();
});

app.use("/user", userRouter);
app.use("/token", tokenRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})