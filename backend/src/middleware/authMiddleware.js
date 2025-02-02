import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "missing token" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log("token = ",token);
    console.log("process.env.JWT_SECRET = ",process.env.JWT_SECRET);
    console.log("decoded = ", decoded);
    console.log("err = ", err);
    if (err) {
      return res.status(401).json({ error: "Unauthorized, invalid token" });
    }
    return decoded;
  });
  req.userId = decoded.id;
  next();
}

export default authMiddleware;
