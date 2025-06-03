import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { PORT } from "./config/env.js";
import productRouter from "./routes/products.routes.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import cartRouter from "./routes/cart.route.js";
import couponRouter from "./routes/coupon.route.js"
import paymentRouter from "./routes/payment.route.js"
import analyticsRouter from "./routes/analytics.route.js";

const app = express();

connectDB();

app.use(express.json()); // allows you to parse the body of the request
app.use(cookieParser())
app.use(cors());
app.use(helmet()); // helmet is a security middleware that helps you protect your app by setting various HTTP Headers
app.use(morgan("dev")); // log the requests

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/", (req, res) => {
    res.send("hello from the test route");
});

app.listen(PORT, async () => {
    console.log("Server is running on port " + PORT);
});