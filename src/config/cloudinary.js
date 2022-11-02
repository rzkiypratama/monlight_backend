const cloud = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.key,
  api_secret: process.env.secret,
  secure: true,
})

module.export = cloud