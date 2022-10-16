const usersRepo = require("../repository/users")

const usersController = {

  get: async (req, res) => {
    try {
      const response = await usersRepo.getUser(req.body);
      res.status(200).json({
        result: response.rows,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Internal Server Error",
      });
    }
  },

  post: async (req, res) => {
    try {
    const result = await usersRepo.postUser(req.body, req.file)
          res.status(201).json({
            msg: "Create New User Success!",
            result: result.rows.body,
          });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  patch: async (req, res) => {
    try {
      usersRepo.editUser(req.body, req.params)
      res.status(200).json({ msg: "Update Success!"})
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  clear: async (req, res) => {
    try {
      const result = usersRepo.clearUser(req.params)
      res.status(200).json({
        message: "Delete Data Successfully!",
        result: result.rows,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
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
    
    };
  //     editPwd: (req, res) => {
  //     const {body} = req
  //     usersRepo
  //     .editPwd(body)
  //     .then((response) => {
  //       res.status(200).json({
  //         msg: "Password has been changed",
  //         data: null,
  //       })
  //     })
  //     .catch((objErr) => {
  //     const statusCode = objErr.statusCode || 500;
  //     res.status(statusCode).json({msg: objErr.err.message});
  //     })
  //   },
  // };
    
    module.exports = usersController;
