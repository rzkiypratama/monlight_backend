const express = require("express");

const usersRouter = express.Router();

const isLogin = require("../Middleware/isLogin")

const upload = require("../Middleware/upload")


const { get, post, patch, clear, reg, editPwd, allGetUser} = require("../controller/users")

//register
usersRouter.post("/register", reg);
// edit password
usersRouter.patch("/account", editPwd);
// // edit profile
// usersRouter.patch("/edit", (req, res) => { })

usersRouter.get("/", isLogin(),get);

usersRouter.get("/regdata", isLogin(),allGetUser);

usersRouter.post("/", isLogin(), upload.single("images"),post);

usersRouter.patch("/:id", patch);

usersRouter.delete("/:id", clear);

module.exports = usersRouter;
