const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  
  destination: (req, file, cb) => {
    cb(null, "./uploads/images");
  },
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e3)}`;
    const ext = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${suffix}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000} // validasi "file to large, max 1mb"
});


module.exports = upload;