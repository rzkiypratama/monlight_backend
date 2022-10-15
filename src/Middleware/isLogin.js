const jwt = require("jsonwebtoken")

module.exports = () => {
  return (req, res, next) => {
    const token = req.header("access-token");
    if (!token) return res.status(401).json({message: "Ninu ninu ninu login dulu mas"})
    // untuk keperluan verifikasi
    jwt.verify(token, process.env.secret_key,{issuer: process.env.issuer}, (err, decoded) => {
      if(err){
        console.log(err)
        return res.status(403).json({msg: err.message})
      }
      // payload untuk cek role // payload tempel ke objek req
req.userPayload = decoded;
next();
    });
  };
}