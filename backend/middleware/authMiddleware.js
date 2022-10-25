const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = (req, res, next) => {
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];
  if (token == null) {
    res.status(401);
    throw new Error("Authentication token needed");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403);
      throw new Error("Invalid authorization token");
    }
    req.user = user;
    next();
  });
};


module.exports = protect
