const express = require("express");
const transactionRouter = express.Router();
const {get, getAll, post, patch, clear} = require("../controller/transactions")
const isLogin = require('../middleware/isLogin')
const allowedRoles = require('../middleware/allowedRole')


transactionRouter.get("/", get);

transactionRouter.get("/", isLogin(), allowedRoles("User", "Admin"), getAll)

transactionRouter.post("/", post);

transactionRouter.patch("/:id", patch);

transactionRouter.delete("/:id", clear);

module.exports = transactionRouter;
