//import dependency
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
//import routes
import healthCheckRouter from "./routes/healthcheck.route.js";
import  registerRouter from "./routes/auth.route.js";

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
app.use("/api/v1/users", registerRouter);


export default app;
