const adminMiddleware = (req, res, next) => {
    // req.user userMiddleware se mil raha hai
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access Denied: Admin level permission required!" });
    }
};

module.exports = adminMiddleware;