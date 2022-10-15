const postgreDb = require("../config/postgres")
const authRouter = require("express").Router();
const authController = require("../controller/auth")
const isLogin = require("../Middleware/isLogin")


authRouter.post("/", authController.login)
module.exports = authRouter