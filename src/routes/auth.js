const postgreDb = require("../config/postgres")
const authRouter = require("express").Router();
const authController = require("../controller/auth")

authRouter.post("/", authController.login)
module.exports = authRouter