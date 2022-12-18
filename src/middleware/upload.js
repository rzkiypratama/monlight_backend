const multer = require("multer");
const path = require("path");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/images");
//   },
//   filename: (req, file, cb) => {
//     const fileName = `${file.fieldname}-${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}${path.extname(file.originalname)}`;
//     cb(null, fileName);
//   },
// });

const memory = multer.memoryStorage();
const multerOption = {
  memory,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowedExt = /png|jpg|jpeg/;
    if (!allowedExt.test(ext)) return cb(new Error("Invalid data type"), false);
    cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 },
};

const upload = multer(multerOption).single("image");
const multerHandler = (req, res, next) => {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        msg: "File too large, image must be 2MB or lower",
      });
    } else if (error) {
      console.log(error);
      return res.status(415).json({ status: 415, msg: error.message });
    }
    next();
  });
};

module.exports = multerHandler;