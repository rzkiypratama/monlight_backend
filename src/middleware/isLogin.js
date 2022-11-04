const jwt = require("jsonwebtoken");
const postgreDb = require("../config/postgres");
const isLogin = () => {
  return (req, res, next) => {
    const token = req.header("access-token");
    if (!token) return res.status(401).json({ msg: "You have to login first" });

    const query = "select token from blacklist where token = $1";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
      }
      if (result.rows.length !== 0)
        return res.status(403).json({ msg: "You have to login" });
    });
    jwt.verify(token, process.env.secret_key, (error, decodedPayload) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: error.name });
      }
      req.userPayload = decodedPayload;
      req.token = token;
      next();
    });
  };
};
module.exports = isLogin;