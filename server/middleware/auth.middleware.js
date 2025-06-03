import { ACCESS_TOKEN_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;

        if(!accessToken) {
            return res.status(401).json({ message: "Unauthorized - No access token provided" });
        }

        try {
            const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password");

            if(!user) {
                return res.status(401).json({ message: "User not found" });
            }

            req.user = user;

            next();
        } catch (error) {
            if(error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - Access token expired" });
            }
            throw error; 
        }
        
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid access token" });
    }
}

export const adminRoute = async (req, res, next) => {
    if(req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access Denied - Admin only" });
    }
}