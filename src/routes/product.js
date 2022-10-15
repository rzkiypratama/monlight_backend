const express = require("express");

const productsRouter = express.Router();

const upload = require("../Middleware/upload")

const {get, post, patch, clear, search, filter, sort} = require("../controller/product");

productsRouter.get("/sort", sort); /*ini routing sort*/

productsRouter.get("/get", get);

productsRouter.get("/:category", filter)


productsRouter.get("/", search);


productsRouter.post("/", upload.single("images"), post);

productsRouter.patch("/:id", patch);

productsRouter.delete("/:id", clear);




module.exports = productsRouter;
