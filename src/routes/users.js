const express = require("express");

const usersRouter = express.Router();

const isLogin = require("../middleware/isLogin")

const upload = require("../middleware/upload")

const { get, post, patch, clear, reg, editPwd, allGetUser} = require("../controller/users")

//register
usersRouter.post("/register", reg);
// edit password
usersRouter.patch("/account", editPwd);
// // edit profile
// usersRouter.patch("/edit", (req, res) => { })

usersRouter.get("/", isLogin(),get);

usersRouter.get("/regdata", isLogin(),allGetUser);

usersRouter.post("/", isLogin(), upload, post);

usersRouter.patch("/profile", isLogin(), upload, patch);

usersRouter.delete("/:id", clear);

module.exports = usersRouter;
