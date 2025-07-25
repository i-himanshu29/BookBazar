import multer from "multer";
import path from "path";
import fs from "fs";

// temp uploads folder
const tempDir = "public/images";
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, tempDir);
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1621234567890.jpg
   },
});

export const upload = multer({ storage });
