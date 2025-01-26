import { connection } from "../database/Database.js";

export async function registerEmail(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const token = req.body.token;

  if (!email) res.json({ status: false, message: "Email is required" });
  else if (!name) res.json({ status: false, message: "Name is required" });
  else if (!token) res.json({ status: false, message: "Token is required" });
  else {
    try {
      await connection.execute(
        "INSERT INTO `tokens` (`name`, `email`, `token`, `userID`) VALUES (?, ?, ?, ?)",
        [name, email, token, req.userID]
      );

      res.json({ status: true });
    } catch (err) {
      res.json({
        status: false,
        message: "Internal Error Occured",
      });
    }
  }
}

export async function getEmails(req, res) {
  try {
    const [rows] = await connection.execute(
      "SELECT name, email, token FROM `tokens` WHERE `userID`=?",
      [req.userID]
    );

    res.json({ status: true, data: rows });
  } catch (err) {
    res.json({
      status: false,
      message: "Internal Error Occured",
    });
  }
}

export async function deleteMail(req, res) {
  const email = req.body.email;

  if (!email) {res.json({ status: false, message: "Email is required" }); return}
  try {
    await connection.execute(
      "DELETE from `tokens` WHERE `email`=?",
      [email]
    );

    res.json({ status: true });
  } catch (err) {
    res.json({
      status: false,
      message: "Internal Error Occured",
    });
  }
}
