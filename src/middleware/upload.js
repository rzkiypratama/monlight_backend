const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/images");
  },
  filename: (req, file, cb) => {
    const fileName = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});
const multerOption = {
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/jpeg"
    )
      return cb(new Error("Invalid data type"));
    cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 },
};
const upload = multer(multerOption).single("images");

const multerHandler = (req, res, next) => {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ status: "Upload Error", msg: error.message });
    } else if (error) {
      return res.status(415).json({ msg: error.message });
    }
    next();
  });
};

module.exports = multerHandler;