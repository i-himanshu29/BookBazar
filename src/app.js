//import dependency
import express from "express"
import cookieParser from "cookie-parser"

//import routes


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser());

// here routes 


export default app;