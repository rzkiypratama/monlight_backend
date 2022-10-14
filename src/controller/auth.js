const authRepo = require("../repository/auth")

module.exports = {
  login: (req, res) => {
    authRepo.login(req.body)
    .then((response) => {
      res.status(200).json({
        data: response,
        msg: "Welcome"
      })
    })
    .catch((objErr) => {
      const statusCode = objErr.statusCode || 500;
      res.status(statusCode).json({msg: objErr.err.message});
    });
  },
}