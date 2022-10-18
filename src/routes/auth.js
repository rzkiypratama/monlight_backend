const postgreDb = require("../config/postgres")
const authRouter = require("express").Router();
const authController = require("../controller/auth")
const login = require("../Middleware/isLogin")


authRouter.post("/", authController.login)

authRouter.delete("/delete", login(), authController.logout);

module.exports = authRouter