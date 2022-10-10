const express = require("express");

const transactionRouter = express.Router();

const {get, post, patch, clear} = require("../controller/transactions")

transactionRouter.get("/", get);

transactionRouter.post("/", post);

transactionRouter.patch("/:id", patch);

transactionRouter.delete("/:id", clear);

module.exports = transactionRouter;
