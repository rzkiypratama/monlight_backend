const express = require("express");
const productsRouter = express.Router();
const upload = require("../middleware/upload")
const allowedRoles = require("../middleware/allowedRole");
const {get, post, patch, clear, search, filter, sort} = require("../controller/product");
const login = require("../middleware/isLogin")

productsRouter.get("/sort", sort); /*ini routing sort*/

productsRouter.get("/get", login(), allowedRoles("Admin"), get);

productsRouter.get("/:category", filter)

productsRouter.get("/", search);

productsRouter.post("/", upload, post);

productsRouter.patch("/:id",upload, patch); // belum dikasih middleware kayak yg atas

productsRouter.delete("/:id", clear);




module.exports = productsRouter;
