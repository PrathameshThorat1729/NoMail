import jwt from "jsonwebtoken"

export function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ status: false, message: 'Access denied' });
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    req.userID = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ status: false, message: 'Invalid token' });
  }
};
