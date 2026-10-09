const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) throw new Error("Token is not present");

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = payload;

    if (!id) throw new Error("Invalid Token");

    const user = await User.findById(id);
    if (!user) throw new Error("User doesn't exist");

    req.user = user.toObject();

    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = userMiddleware;
