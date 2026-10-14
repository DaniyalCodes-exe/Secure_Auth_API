const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// PROTECT MIDDLEWARE (check access token)
exports.protect = async (req, res, next) => {
  try {
    let token;

    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // taking the token from Bearer
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, access denied. No token provided",
      });
    }

    // Token verify
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    // User find
    req.user = await userModel.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    next(); // guard pass
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token is invalid or expired.",
      error: error.message,
    });
  }
};

//ADMIN authorization

exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Access forbidden. Admin rights required",
    });
  }
};