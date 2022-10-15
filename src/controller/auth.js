const authRepo = require("../repository/auth")
const usersRepo = require("../repository/users")

const authController = {

  login: (req, res) => {
    authRepo.login(req.body)
    .then((response) => {
      res.status(200).json({
        data: response,
        msg: "Welcome",
      })
    })
    .catch((objErr) => {
      const statusCode = objErr.statusCode || 500;
      res.status(statusCode).json({msg: objErr});
    });
  },

  reg: async (req, res) => {
    try {
    const response = await usersRepo.regUser(req.body);
      res.status(201).json({
        message: "Register Success",
        data: {
          ...response.rows[0],
          email: req.body.email,
          username: req.body.username,
        }
      })
    } catch (err) {
      res.status(500).json({message: "Internal Server Error", error: err.message
    })
    }
  },

  editPwd: async (req, res) => {
    try {
    const response = await usersRepo.editPwd(req.body)
      res.status(200).json({
        msg: "Password has been changed",
        // response: null,
      })
    } catch (objErr) {
      const statusCode = objErr.statusCode || 500;
    res.status(statusCode).json({msg: objErr.err.message});
      }
    },
  
}

module.exports = authController