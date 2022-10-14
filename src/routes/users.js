const express = require("express");

const usersRouter = express.Router();

const { get, post, patch, clear, reg, editPwd} = require("../controller/users")

//register
usersRouter.post("/register", reg);
// edit password
usersRouter.patch("/account", editPwd);
// // edit profile
// usersRouter.patch("/edit", (req, res) => { })

usersRouter.get("/", get);

usersRouter.post("/", post);

usersRouter.patch("/:id", patch);

usersRouter.delete("/:id", clear);

module.exports = usersRouter;
