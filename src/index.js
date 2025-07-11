import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/dbconnect.js";

dotenv.config({
   path: "./.env",
});
const port = process.env.PORT || 8080;

connectDB()
   .then(() => {
      app.listen(port, () => {
         console.log(`Server is listening on PORT : ${port}`);
      });
   })
   .catch((err) => {
      console.log("MongoDB connection error", err);
      process.exit(1);
   });
