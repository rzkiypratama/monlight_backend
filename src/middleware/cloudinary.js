const DatauriParser = require('datauri/parser')
const cloudinary = require('../config/cloudinary');
const path = require ("path")

const uploader = async (req, res, next) => {
  const {body, file} = req
  if (!file) return next();
  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname.toString).toString();
  const dataUri = parser.format(ext, buffer);
  // const fileName = `${body.prefix}_${body.user_id}`;
  const cloudinaryOpt = {
    public_id: `${Math.floor(Math.random() * 10e9)}`,
    folder: 'monlight-project'
  };

    try {
      cloudinary.uploader.upload(
        dataUri.content,
        cloudinaryOpt
        );
      req.file = result;
      next()
    } catch (error) {
      return res.status(415).json({ status: 415, msg: error.message });
    }
}

module.exports = uploader