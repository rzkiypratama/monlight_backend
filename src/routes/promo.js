const express = require("express");

const promosRouter = express.Router();

const {get, post, patch, clear, search} = require("../controller/promo")

promosRouter.get("/get", get);

promosRouter.post("/", post);

promosRouter.patch("/:id", patch);

promosRouter.delete("/:id", clear);

promosRouter.get("/", search);

module.exports = promosRouter;
