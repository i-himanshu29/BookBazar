//import dependency
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//import routes
import healthCheckRouter from "./routes/healthcheck.route.js";
import userRouter from "./routes/auth.route.js";
import bookRouter from "./routes/book.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import reviewRouter from "./routes/review.route.js";
import addressRouter from "./routes/address.route.js";
import paymentRouter from "./routes/payment.route.js";
import adminRouter from "./routes/admin.route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//cors
app.use(
   cors({
      origin: process.env.BASE_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
   }),
);

// here routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/admin", adminRouter);

export default app;
