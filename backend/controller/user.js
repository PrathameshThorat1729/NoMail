import { connection } from "../database/Database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function registerUser(req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!username) res.json({ status: false, message: "Username is required" });
  else if (username.length < 3 || username.length > 12)
    res.json({
      status: false,
      message: "Username must be between 3 and 12 characters",
    });
  else if (!email) res.json({ status: false, message: "Email is required" });
  else if (!password)
    res.json({ status: false, message: "Password is required" });
  else if (password != confirmPassword) {
    res.json({
      status: false,
      message: "Passwords don't match",
    });
  } else {
    const passwordHash = bcrypt.hashSync(password, 10);

    try {
      await connection.execute(
        "INSERT INTO `users` (`username`, `email`, `passwordHash`) VALUES (?, ?, ?)",
        [username, email, passwordHash]
      );

      res.json({ status: true });
    } catch (err) {
      if (err.code == "ER_DUP_ENTRY")
        res.json({
          status: false,
          message: `User with Email already exists`,
        });
      else
        res.json({
          status: false,
          message: "Internal Error Occured",
        });
    }
  }
}

export async function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email) res.json({ status: false, message: "Email is required" });
  else if (!password)
    res.json({ status: false, message: "Password is required" });
  else {
    try {
      const [result] = await connection.execute(
        "SELECT * from `users` WHERE `email`=?",
        [email]
      );

      if (result.length == 0)
        res.json({ status: false, message: "Invalid Email or Password" });
      else if (bcrypt.compareSync(password, result[0].passwordHash)) {
        const token = jwt.sign(
          {
            id: result[0].id,
            email: result[0].email,
            username: result[0].username,
          },
          process.env.JWT_SECRET_KEY);

        res.json({ status: true, token });
      } else res.json({ status: false, message: "Invalid Email or Password" });
    } catch (err) {
      res.json({
        status: false,
        message: "Internal Error Occured",
      });
    }
  }
}
