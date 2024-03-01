const express = require("express");
const cloudinary = require("cloudinary").v2;
const { auth } = require("../middlewares/auth");
const { config } = require("../config/secret");
const router = express.Router();

// בפרוייקט אמיתי הערכים של המשתנים צריכים להיות ב
// .ENV
cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET,
});

router.get("/", async (req, res) => {
  res.json({ msg: "Upload work" });
});

router.post("/cloud_server", async (req, res) => {
  try {
    const myFile = req.body.myFile;
    if (myFile) {
      // מעלה את התמונה לקלואדינרי
      const data = await cloudinary.uploader.upload(myFile, {
        unique_filename: true,
      });
      // console.log(myFile);
      // יחזיר פרטים על התמונה שנמצאת בשרת כולל הכתובת שלה
      // ב secure_url
      res.json(data);
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post("/cloud1", async (req, res) => {
  try {
    const myFile = req.files.myFile;
    if (myFile) {
      // מעלה את התמונה לקלואדינרי
      const data = await cloudinary.uploader.upload(myFile.tempFilePath, {
        unique_filename: true,
      });
      // console.log(myFile);
      // יחזיר פרטים על התמונה שנמצאת בשרת כולל הכתובת שלה
      // ב secure_url
      res.json(data);
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
