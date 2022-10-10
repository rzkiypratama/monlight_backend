const express = require("express");

const usersRouter = express.Router();

const {get, post, patch, clear} = require("../controller/users")

usersRouter.get("/", get);

usersRouter.post("/", post);

usersRouter.patch("/:id", patch);

usersRouter.delete("/:id", clear);

module.exports = usersRouter;
