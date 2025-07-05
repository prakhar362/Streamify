import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    console.log("Auth middleware - cookies:", req.cookies);
    console.log("Auth middleware - headers:", req.headers);
    
    const token = req.cookies.jwt;

    if (!token) {
      console.log("No JWT token found in cookies");
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    console.log("JWT token found:", token.substring(0, 20) + "...");

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      console.log("Invalid JWT token");
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    console.log("JWT decoded successfully:", decoded);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("User not found for ID:", decoded.userId);
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    console.log("User found:", user._id);
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};