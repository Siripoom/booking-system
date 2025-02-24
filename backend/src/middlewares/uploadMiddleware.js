const multer = require("multer");
const path = require("path");

// ตั้งค่า Storage สำหรับเก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ไฟล์จะถูกเก็บในโฟลเดอร์ `uploads/`
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // ตั้งชื่อไฟล์ตาม timestamp
  },
});

// ตรวจสอบไฟล์ว่าเป็นรูปภาพหรือไม่
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
