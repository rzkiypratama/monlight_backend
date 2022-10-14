const express = require("express");

const usersRouter = require("./users");
const productsRouter = require("./product");
const transactionsRouter = require("./transaction");
const promosRouter = require("./promo")
const authRouter = require("./auth")

const mainRouter = express.Router();

const prefix = "/api/monlight-project";

mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/products`, productsRouter);
mainRouter.use(`${prefix}/transactions`, transactionsRouter);
mainRouter.use(`${prefix}/promos`, promosRouter);
mainRouter.use(`${prefix}/auth`, authRouter)

module.exports = mainRouter;

