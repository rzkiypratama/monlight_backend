const DatauriParser = require('datauri/parser')
const cloudinary = require('../config/cloudinary');
const path = require ("path")

const uploader = async (req, res, next) => {
  const {body, file} = req
  if (!file) return next();
  const parser = new DatauriParser();
  const buffer = file.buffer;
  const ext = path.extname(file.originalname.toString).toString();
  const datauri = parser.format(ext, buffer);
  const fileName = `${body.prefix}_${body.user_id}`;
  const cloudinaryOpt = {
    public_id: fileName,
    folder: 'monlight-project'
  };

    try {
      cloudinary.uploader.upload(
        datauri,
        cloudinaryOpt
        );
      req.file = result;
      next()
    } catch (err) {
      res.status(err).json({msg: "internal server error"})
    }
}

module.exports = uploader