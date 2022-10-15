const promosRepo = require("../repository/promo")

const promosController = {
  get: async (req, res) => {
    try {
      const response = await promosRepo.getPromo(req.body);
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
      console.log(req.body)
    const result = await promosRepo.postPromo(req.body)
          res.status(201).json({
            msg: "Create New promo Success!",
            result: result.rows.body,
          });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  patch: async (req, res) => {
    try {
      promosRepo.editpromo(req.body, req.params)
      res.status(200).json({ msg: "Update Success!"})
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  clear: async (req, res) => {
    try {
      const result = promosRepo.clearPromo(req.params)
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

    search: async (req, res) => {
      try {
        const result = await promosRepo.searchPromo(req.query)
        res.status(200).json({
          result: result.rows,
        });
      } catch (err) {
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
      },
};

module.exports = promosController;
