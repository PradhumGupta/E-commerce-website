import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, NODE_ENV } from "../config/env.js";
import redisClient from "../config/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const isProd = NODE_ENV === "production";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m', })

    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redisClient.set(`refresh_token_${userId}`, refreshToken, {
        EX: 60 * 60 * 24 * 7 // 7 days
    });
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("access_token", accessToken, {
        httpOnly: true, // prevents XSS attacks, cross-site scripting
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
}

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if(userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({
            name,
            email,
            password
        });

        // authenticate
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateTokens(user._id);

            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(401).json({ message: "Invalid Email or Password "})
        }
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({ message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        if(refreshToken) {
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
            await redisClient.del(`refresh_token_${decoded.userId}`);
        }

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({ message: "Server Error", error })
    }
}

// this  will refresh the access token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        if(!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" })
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const storedToken = await redisClient.get(`refresh_token_${decoded.userId}`);

        if(storedToken !== refreshToken) {
            return res.status(404).json({ message: "Invalid refresh token" })
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.cookie("access_token", accessToken, {
            httpOnly: true, // prevents XSS attacks, cross-site scripting
            secure: isProd,
            sameSite: isProd ? "None" : "Lax",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.json({ message: "Token refreshed successfully" });

    } catch (error) {
        console.log("Error in refreshToken controller", error.message);
        res.status(500).json({ message: "Server error", error})
    }
}

export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.log("Error in getProfile controller", error.message);
        res.status(500).json({ message: "Server Error", error });
    }
}